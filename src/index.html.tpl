<!doctype html>
<html lang="<%- code %>">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1, maximum-scale=1">
  <meta name="description" content="Generador i simulador de malabars" />
  <!--<link href='http://fonts.googleapis.com/css?family=Josefin+Sans:400,700' rel='stylesheet' type='text/css'>-->
  <link rel="stylesheet" href="styles/main.css" />
  <title>joggol</title>
</head>
<body>
  <div id="wrapper" class="wrapper simulator-disabled">
    <header id="header" class="header">
      <div class="presentation">
        <nav class="languages links">
          <ul>
            <li>
              <a lang="<%- header.languages[0].code %>" href="http://xgbuils.github.io/<%- header.languages[0].code %>-joggol/"><%- header.languages[0].name %></a>
            </li>
            <li>
              <a lang="<%- header.languages[1].code %>" href="http://xgbuils.github.io/<%- header.languages[1].code %>-joggol/"><%- header.languages[1].name %></a>
            </li>
          </ul>
        </nav>
        <!--<div class="icon-logo"></div>-->
        <div class="header-main">
          <h1 class="title">joggol</h1>
          <p class="description">
            <%= header.description %>
          </p>
          <a href="#generator" class="internal-link header-btn btn" id="header-btn"><%- header.tryit %></a></a>
        </div>
        <div class="samples-wrapper">
          <div class="samples">
            <ul id="samples">
              <li>
                <p class="ask"><%- header.samples[0].ask %></p>
                <div class="hint">
                  <a href="#" class="internal-link"><%- header.samples[0].answer %></a>
                </div>
              </li>
              <li>
                <p class="ask"><%- header.samples[1].ask %></p>
                <div class="hint">
                  <a href="#" class="internal-link"><%- header.samples[1].answer %></a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="menu-header">
        <a href="#header" class="internal-link title">joggol</a>
      </div>
    </header>
    <section id="generator" class="generator">
      <div class="fieldset">
        <h2><%- generator.balls %></h2>
        <div id="balls" class="editable balls">
          <span class="word-expanded"><%- generator.word.between %></span>
          <span class="contenteditable min" id="balls-min">3</span>
          <span class="collapsed word-minLessOrEq1 hide"><%- generator.word.maximum %></span><span class="word-expanded"><%- generator.word.and %></span>
          <span class="contenteditable max" id="balls-max">3</span>
        </div>
      </div>
      <div class="fieldset">
        <h2><%- generator.periods %></h2>
         <div id="periods" class="editable periods">
          <span class="word-expanded"><%- generator.word.between %></span><span class="collapsed hide"><%- generator.word.of %></span>
          <span class="contenteditable min" id="periods-min">2</span>
          <span class="collapsed word-minLessOrEq1 hide"><%- generator.word.maximum %></span><span class="word-expanded">i</span>
          <span class="contenteditable max" id="periods-max">3</span>
        </div>
      </div>
      <div class="fieldset">
        <!--Alçada màxima-->
        <h2><abbr class="h2-height" title="<%- generator.heights.title %>"><span><%= generator.heights.content %></span></abbr></h2>
        <div id="heights" class="editable heights">
          <span class="collapsed word-minEqMax hide"><%- generator.word.just %></span>
          <%- generator.word.from %>
          <span class="contenteditable min" id="heights-min">1</span>
          <span class="word-expanded"><%- generator.word.to%></span>
          <span class="contenteditable max" id="heights-max">5</span>
        </div>
      </div>
      <div class="fieldset patterns-description">
        <h2><%- generator.description.title %></h2>
        <span id="error"></span>
        <span id="success">
          <%- generator.description.patterns %>
          <span id="description-balls"></span>
          <span id="description-periods"></span>
          <span id="description-heights"></span>
        </span>
      </div>
      <div class="create">
        <a id="create" class="internal-link btn" href="#simulator"><%- generator.generate %></a>
      </div>
    </section>
    <section class="simulator" id="simulator">
      <div id="juggler-simulator">
      </div>
    </section>
  </div>
  <div id="touch"></div>
  <div id="keyboard" class="keyboard hide">
    <div class="icon-left" id="keyboard-left"></div>
    <div class="buttons-container" id="keyboard-buttons">
      <div class="buttons" id="keyboard-balls"></div>
      <div class="buttons" id="keyboard-periods"></div>
      <div class="buttons" id="keyboard-heights"></div>
      <div class="buttons" id="keyboard-patterns"></div>
    </div>
    <div class="icon-right" id="keyboard-right"></div>
  </div>
  <script src="js/jquery.min.js"></script>
  <script src="js/main.js"></script>
</body>
</html>