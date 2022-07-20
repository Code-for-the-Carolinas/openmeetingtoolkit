## Greg Janesch, last edited 2022-05-10
## This is a short script for accessing Alamance County's boards & committees
## page and scraping information on the meetings from it.
## Note that the format on the website is not well-standardized, so getting the
## data into the desired structure required manual curation as well.

from bs4 import BeautifulSoup
import pandas as pd
import requests

def find_line_starting_with(paragraph_list, starting_text):
    ## Isolates the line that starts with the specified text string.
    ## This was the best idea that I had for isolating specific parts
    ## of the committee webpages.
    line_filter = filter(lambda p: p.startswith(starting_text), paragraph_list)
    try:
        ## Use .strip() since there's some weird whitespace sometimes.
        return next(line_filter)[len(starting_text):].strip()  
    except StopIteration:
        return ""


COMMITTEE_PAGE = "https://www.alamance-nc.com/boardscommittees/"


## Site blocks requests.get() based on its headers, so change the User-Agent 
## to bypass this.
top_page_html = requests.get(COMMITTEE_PAGE, headers={"User-Agent": "Steve"})

## Let BeautifulSoup parse the HTML, and isolate the element with the links to the
## committees' separate pages.
top_page_soup = BeautifulSoup(top_page_html.text, "lxml")
columns = top_page_soup.find_all("div", attrs={"class": "wp-block-column"})
committee_links = [x for c in columns for x in c.find_all("a")]

## Isolate the elements we're looking for -- URL, committee name, and meeting
## location and time -- then return it as a tuple and append to a list.
info_tuples = []
for cl in committee_links:
    meeting_html = requests.get(cl["href"], headers = {"User-Agent": "Steve"})
    meeting_soup = BeautifulSoup(meeting_html.text, "lxml")
    meeting_info = meeting_soup.find("div", attrs={"pe-article-content"})
    paragraphs = [p.text for p in meeting_info.find_all("p")]
    
    schedule = find_line_starting_with(paragraphs, "Meeting Schedule:")
    location = find_line_starting_with(paragraphs, "Meeting Location:")
    info = (cl.text, location, schedule, cl["href"])
    info_tuples.append(info)

## Turn the tuple list into a dataframe and dump to a CSV.  The sort is only for convenience,
## since it seemed like that would be preferred in the final dataset.
pd.DataFrame(info_tuples, columns = ["Name", "Location", "Time", "Link"]).sort_values("Name").to_csv("alamance.csv")
