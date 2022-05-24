# Piper's Splits Analyzer
Welcome to my splits analyzer program! This is my first real project in CS (went into this with zero proper coding experience, much less JavaScript experience) and it started out as part of my APCSP final project.

## What does it do?
Currently, this website will:
- Greet you with a welcome page that contains basic instructions
- Meet you with a random weeb splits background image (credited to the artist)
- Prompt you to drag and drop a LiveSplit splits file (.lss)
- Analyze and display data from the file
- Allow you to generate a custom comparison of a set length
  - Choose from two calculation options (default and simple)

## What is the comparison calculation doing?
The comparison calculation is slightly complicated, but simply put:
- Using details parsed from the splits to "weigh" the timesave to allocate for each split
  - Average timeloss to gold
  - Reset frequency
  - Length of split
- Distributing timesave to each split based on a ratio of the difference between the supplied goal time and Sum Of Best
## Future goals for the project
This isn't done being developed, and I'd like to add more features over time to make this a sort of "hub" for some nifty splits tools.
I would like to:
- Add statistical analysis of the splits, similar to that of [timeloss.run](https://timeloss.run) by Corvimae
- Add more customizability and accessibility to the tools present

## Who inspired me?
- This was inspired primarily by [Splitmaker](https://minibeast.me/splitmaker/) by Mini
- Additionally, [timeloss.run](https://timeloss.run) by Corvimae
- Simple splits formula was inspired by [Source28's](https://twitter.com/Source28_) splits generator

## I have an idea/question! How can I contact you?
- Message me on Discord at Piper#1109
- Message me on Twitter [here](https://twitter.com/piperdumpy)

## Special thanks:
- WamWooWam and Mini for assistance in learning JS, couldn't have done it without them

- Various friends for supplying splits files to debug with
  - Mini
  - BlipBlo
  - Source
  - Wam
  - Shayy
  - Tyron
