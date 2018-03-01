'use strict';

var test = require('tape');
var retext = require('retext');
var keywords = require('./');

/* Fixture: First three paragraphs on Term Extraction from Wikipedia:
 * http://en.wikipedia.org/wiki/Terminology_extraction.
 * There’s also some `constructor`s sprinkled throughout the
 * document to check if prototypal properties work correctly. */
var fixture = "Pour les produits qui ne contiennent pas d'additifs artificiels, suis prêt à payer plus (consommation alimentaire opinions alimentation).\n" + 
              "Lis les étiquettes des aliments pour voir les ingrédients qui entrent dans la composition (consommation alimentaire opinions alimentation).\n" + 
              "Fais en sorte de manger, chaque jour, les 5 portions de fruits et légumes recommandées (consommation alimentaire opinions alimentation).\n" + 
              "Adore réellement faire la cuisine (consommation alimentaire opinions alimentation).\n" + 
              "Temps préparation repas soir semaine (alimentation (rdae) les repas).\n" + 
              "Toujours en train de chercher et expérimenter nouvelles recettes (consommation alimentaire opinions alimentation).\n" + 
              "Revenu mensuel net du foyer (signaletique le foyer).";

// TODO recalculate expected scores for french fixture
var keyScores = [1, 1, 0.71, 0.71, 0.57, 0.57];
var phraseScores = [1, 0.55, 0.53, 0.24, 0.18];

test('keywords()', function (t) {
  retext().use(keywords).process(fixture, function (err, file) {
    t.ifErr(err, 'should not fail');

    t.test('should work', function (st) {
      st.ok('keywords' in file.data);
      st.assert('keyphrases' in file.data);

      console.log("file.data.keywords.length", file.data.keywords.length);
      console.log("file.data.keyphrases.length", file.data.keyphrases.length);
      st.equal(file.data.keywords.length, 7);
      st.equal(file.data.keyphrases.length, 5);

      st.end();
    });

    /*
    t.test('should have scores', function (st) {
      file.data.keywords.forEach(function (keyword, n) {
        console.log("Math.round(keyword.score * 1e2) / 1e2, keyScores[n]", Math.round(keyword.score * 1e2) / 1e2, keyScores[n]);
        st.equal(
          Math.round(keyword.score * 1e2) / 1e2,
          keyScores[n]
        );
      });

      file.data.keyphrases.forEach(function (phrase, n) {
        console.log("Math.round(phrase.score * 1e2) / 1e2, phraseScores[n]", Math.round(phrase.score * 1e2) / 1e2, phraseScores[n]);
        st.equal(
          Math.round(phrase.score * 1e2) / 1e2,
          phraseScores[n]
        );
      });

      st.end();
    });
    */
    t.test('should have stems', function (st) {
      file.data.keywords.forEach(function (keyword) {
        st.ok('stem' in keyword);
      });

      file.data.keyphrases.forEach(function (phrase) {
        st.ok('stems' in phrase);
      });

      st.end();
    });

    t.test('should have matches', function (st) {
      file.data.keywords.forEach(function (keyword) {
        st.ok('matches' in keyword);
      });

      file.data.keyphrases.forEach(function (phrase) {
        st.ok('matches' in phrase);
      });

      st.end();
    });

    t.test('keywords[n].matches[n]', function (st) {
      file.data.keywords.forEach(function (keyword) {
        keyword.matches.forEach(function (match) {
          st.assert('node' in match);
          st.assert('parent' in match);
          st.assert('index' in match);
        });
      });

      st.end();
    });

    t.test('keyphrases', function (st) {
      st.test('should have a weight', function (sst) {
        file.data.keyphrases.forEach(function (phrase) {
          sst.ok('weight' in phrase);
        });

        sst.end();
      });

      st.test('should have a value', function (sst) {
        file.data.keyphrases.forEach(function (phrase) {
          sst.ok('value' in phrase);
        });

        sst.end();
      });

      st.end();
    });

    t.test('keyphrases[n].matches[n]', function (st) {
      file.data.keyphrases.forEach(function (phrase) {
        phrase.matches.forEach(function (match) {
          st.ok('nodes' in match);
          st.ok('parent' in match);
        });
      });

      st.end();
    });

    t.end();
  });
});
