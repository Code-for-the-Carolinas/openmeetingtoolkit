## Greg Janesch, last edited 2022-05-22
## This is a short script for accessing Cumberland County's boards & committees
## page and scraping information on the meetings from it.

from bs4 import BeautifulSoup
import pandas as pd
import requests


BOARDS_PAGE = "https://www.cumberlandcountync.gov/departments/commissioners-group/commissioners/appointed-boards/board-descriptions"


top_page_html = requests.get(BOARDS_PAGE)
top_page_soup = BeautifulSoup(top_page_html.text, "lxml")
board_info_elements = top_page_soup.find_all("li", attrs={"data-sf-provider":"OpenAccessProvider"})

board_info_tuples = []
for bie in board_info_elements:
    board_name = bie.find("button").text.strip()
    try:
        meeting_time_element = bie.find("div", attrs={"data-sf-field":"Meetings"})
        meeting_time_info = meeting_time_element.text.strip()
    except:
        meeting_time_info = ""
    try:
        location_element = bie.find("div", attrs={"data-sf-field":"Location"})
        location_info = location_element.text.strip()
    except:
        location_info = ""
    board_info_tuples.append((board_name, location_info, meeting_time_info))

pd.DataFrame(board_info_tuples, columns=["Board Name", "Location", "Schedule"]).to_csv("cumberland.csv")

