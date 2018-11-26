---
layout: post
title:  "News Scraper"
date:   2018-11-25 11:59:45 -0800
categories: project
---
***DISCLAIMER***: *Please check with the website before starting to scrape it. In some cases,*
*web scraping is classified as technology misuse.*

I like to read the news, but over time, I have realized that I have less and less 
time to read the news. To combat this, I tried to just skim the headlines, however,
this led to me missing important details for the story. So, I decided to write a webscraper 
that would get all of the articles on the homepage and pass them through a natural language 
processor to summerize the article.

# Explaination

To make this, I used [Beatiful Soup](https://www.crummy.com/software/BeautifulSoup/). This is 
an amazing package that greatly simplifies the collection of data from webpages. The code is 
broken down with some explainations and the full code will be available at the bottom. I chose 
to use QZ since the pages are relatively easy to parse.

Our first step is to get the "Latest" page and put it into Beautiful Soup. This will allow for us 
to get the URL of the articles with ease.
```python
latest_news = urllib.request.urlopen('https://qz.com/latest/').read()

latest_soup = BeautifulSoup(latest_news, 'html.parser')
messageText = ""
```
Once all of the URLs have been retrieved, we want to enumerate through them to parse each page.

```python
for div in latest_soup.find_all('article', {"class":"cb3ed"}):
    for link in div.find_all('a'):
        url = 'https://qz.com' + str(link.get('href'))
        latest_news = urllib.request.urlopen(url).read()
        text = ""
        latest_soup = BeautifulSoup(latest_news, 'html.parser')
        author = latest_soup.find("a", {"href" : lambda L: L and L.startswith('/author/')})
        paragraphs = latest_soup.findAll("p")

        for para in paragraphs:
            text += " " + para.get_text()

        messageText += "<h3>" + latest_soup.find('h1').get_text() + "</h3>"
        messageText += "<p><a href=\"" + url + "\">" + url + "</a></p>"
        messageText += "<p>" + author.get_text() + "</p>"
        messageText += summarize(text)
```

# Next Steps
1. Clean the code
  * There are multiple areas that could be more efficiently managed/tested by putting them in seperate functions
2. Use the basic functionality for other projects
  * I want to make a Twitter bot that tweets out when a movie in a box office surpasses the GDP of a country

# Full Code

This code will work to send an email to the specified address. You will need to fill in your own email for the fields of email_address and email_password as well as changing the fields in the to_address

```python
import urllib.request
from bs4 import BeautifulSoup
from gensim.summarization import summarize
from email.headerregistry import Address
from email.message import EmailMessage
import smtplib

import datetime

now = datetime.datetime.now()


email_address = "yourEmail@email.com"
email_password = "password" # This will be an app token if using gMail

# Recipent
to_address = (
    Address(display_name='NewsBot', username='yourEmail', domain='email.com'),
)


# Get the top links for the webpage
# get a litle info using natural language processing

latest_news = urllib.request.urlopen('https://qz.com/latest/').read()

latest_soup = BeautifulSoup(latest_news, 'html.parser')
messageText = ""

# Just get the articles
for div in latest_soup.find_all('article', {"class":"cb3ed"}):
    for link in div.find_all('a'):
        url = 'https://qz.com' + str(link.get('href'))
        latest_news = urllib.request.urlopen(url).read()
        text = ""
        latest_soup = BeautifulSoup(latest_news, 'html.parser')
        author = latest_soup.find("a", {"href" : lambda L: L and L.startswith('/author/')})
        paragraphs = latest_soup.findAll("p")

        for para in paragraphs:
            text += " " + para.get_text()

        messageText += "<h3>" + latest_soup.find('h1').get_text() + "</h3>"
        messageText += "<p><a href=\"" + url + "\">" + url + "</a></p>"
        messageText += "<p>" + author.get_text() + "</p>"
        messageText += summarize(text)


msg = EmailMessage()
msg['From'] = email_address
msg['To'] = to_address
msg['Subject'] = "News for:" + now.strftime("%m-%d-%Y")
msg.set_content("plaintext")
msg.add_alternative(messageText, subtype='html')

with smtplib.SMTP('smtp.gmail.com', port=587) as smtp_server:
    smtp_server.ehlo()
    smtp_server.starttls()
    smtp_server.login(email_address, email_password)
    smtp_server.send_message(msg)
```