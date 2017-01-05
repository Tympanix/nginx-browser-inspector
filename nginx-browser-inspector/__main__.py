import re
from os import listdir
from os.path import isfile, join
from colorama import init
from colorama import Fore, Back, Style

init()

BROWSER_PATH = 'data/browsers'
CRAWLER_PATH = 'data/crawlers'

REGEX = [
    re.compile('^Mozilla/5\.0 (Macintosh|Windows( NT [0-9\.]*)?|Android[0-9\.-]+|X11|iPhone|iPad|Linux|'
               'U|WOW64|x86_64|x64|PPC|Win64|Intel|Mac OS X|AppleWebKit/|KHTML|like Gecko|Version/|'
               'Safari/|Chrome/|[\d\._]+\+?|,|\w\w-\w\w|;|\(|\)|\s|)+$')
]

browserfiles = [f for f in listdir(BROWSER_PATH) if isfile(join(BROWSER_PATH, f))]
crawlerfiles = [f for f in listdir(CRAWLER_PATH) if isfile(join(CRAWLER_PATH, f))]


def process_browser(ua):
    for reg in REGEX:
        if reg.match(ua) is None:
            print(Fore.RED + 'Browser: ' + ua)
            return
    print (Fore.GREEN + 'Browser: ' + ua)


def process_crawler(ua):
    for reg in REGEX:
        if reg.match(ua) is not None:
            print (Fore.RED + 'Crawler: ' + ua)
            return
    print (Fore.GREEN + 'Crawler: ' + ua)

for bf in browserfiles:
    with open(join(BROWSER_PATH, bf)) as f:
        for line in f:
            if not line:
                continue
            process_browser(line)

for cf in crawlerfiles:
    with open(join(CRAWLER_PATH, cf)) as f:
        for line in f:
            if not line:
                continue
            process_crawler(line)


