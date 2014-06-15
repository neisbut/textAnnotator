#!/usr/bin/env python2

"""
    Automates running tests through selenium. Experimental.
    Requires Selenium's chromedriver binary to be present in the
    $PATH, and for the iad dir to be served via Plovr.
"""

import os
import time
import sys


from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys

PATH = os.path.dirname(os.path.abspath(__file__))
SERVER = 'http://localhost:9810/test/iad/js/'

files = []
searchpath = PATH + '/js'
for path, dirs, filelist in os.walk(searchpath):
    if '.svn' in path: continue   
    filelist = [path + '/' + f for f in filelist]
    trimlen = len(PATH + '/')
    filelist = [f[trimlen:] for f in filelist]
    files += filter(lambda f: f.endswith('_test.js'), filelist)

files.sort()

print files

results  = []

exit_status = 0

driver = webdriver.Chrome()

for filename in files:
    url = 'http://localhost:9810/test/iad/' + filename.replace('.js', '.html')
    driver.get(url)

    result = {
        'file' : filename,
        'url' : url,
        'timeout' : False,
        'report' : None,
        'success' : False
    }

    iterations = 0
    while not driver.execute_script('return G_testRunner.isFinished()'):
        iterations+=1
        if iterations > 10:
            result['timeout'] = True
            print url + ' timed out...'
            break
        else: time.sleep(1)

    if result['timeout']: continue

    result['report'] = driver.execute_script('return G_testRunner.getReport()')
    result['success'] = driver.execute_script('return G_testRunner.isSuccess()')
    results += [result]

passes, fails, timeouts = [], [], []

for result in results:

    if result['success']:
        passes += [result]
        print 'PASS: ' + result['url']
    else:
        fails += [result]
        print 'FAIL{0}: '.format(' (timeout) ' if result['timeout'] else ''),
        print result['url']


print
print 'Summary:'
print '{0}/{1} tests passed'.format(len(passes), len(results))

driver.quit()

sys.exit(0 if not fails and not timeouts else 1)
