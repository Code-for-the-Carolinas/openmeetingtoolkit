## Greg Janesch, last edited 2022-09-07
## This is a short script for accessing Orange County's boards & committees
## page and scraping information on the meetings from it.

from bs4 import BeautifulSoup
import pandas as pd
import requests
from tqdm import tqdm   # just included to add a progress bar, not necessary

def get_page_soup(url):
    return BeautifulSoup(requests.get(url).content, "lxml")

## COUNTY_PAGE is the list of boards, but the links in the <a> elements are
## just routes, so we need the base URL as well.
COUNTY_PAGE = "https://www4.orangecountync.gov/boards/listing.asp"
BOARD_BASE_URL = "https://www4.orangecountync.gov/boards/"

## Collect board names and URLs; there are other URLs on the page that aren't
## boards, but the ones that are have routes starting with "indivbd"
soup = get_page_soup(COUNTY_PAGE)
name_url_pairs = [(x.text, x["href"]) for x in soup.find_all("a") if x["href"].startswith("indivbd")]

## Main scraping operation.  
info_tuples = []
for nup in tqdm(name_url_pairs):
    name, url = nup
    board_soup = get_page_soup(BOARD_BASE_URL + url)
    main_table = board_soup.find("table")
    info_elements = main_table.find_all("td")
    
    schedule = info_elements[0].text.strip()
    location = info_elements[2].text.strip()
    
    ## Some pages have multiple emails split by semicolons, which mess up some
    ## spreadsheet software, but changing to commas gets Pandas to handle it
    contact_email = info_elements[5].text.strip()
    contact_email = contact_email.replace(";", ",")
    
    ## Some pages link to an additional page with more info; some of those links
    ## are useful, so grab them
    if site:= board_soup.find("a", string=name):
        additional_link = site["href"]
    else:
        additional_link = ""
    
    info_tuples.append((name, schedule, location, contact_email, BOARD_BASE_URL + url, additional_link))

colnames = ["Board Name", "Meeting Schedule", "Meeting Location", "Contact Email", "Board URL", "Additional URL"]
pd.DataFrame(info_tuples, columns=colnames).to_csv("orange.csv", index=None)