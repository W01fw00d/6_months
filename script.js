$(document).ready(init);

NORTH_SUMMER_STATE = 0;
SOUTH_WINTER_STATE = 1;
GAME_OVER_STATE = 2;

state = NORTH_SUMMER_STATE;

BASE_DURATION = 5;
season_duration = BASE_DURATION;

season_timer = season_duration;
score_timer = 0;

score_timeout = null;
season_timeout = null;

function init() 
{
  $('body').one('click', () => {
    $('.curtain').hide();
    
    init_state();
    init_score_timeout();
    init_season_timeout();
  
    $('body').click(() => {
      if (state !== GAME_OVER_STATE) {
        switch_state();
      }
    });
  });
};

function init_score_timeout()
{
  score_timeout = setTimeout(
    () => {
      if (state !== GAME_OVER_STATE) {
        score_timer = score_timer + 0.5;
        init_score_timeout();
      }
    }, 
    500
  );
}

function init_state()
{
  $('.half-circle-top').addClass('coldest-hemisphere');
  $('.half-circle-top').css('animation-duration', season_duration + 's');
  $('.half-circle-top .slot').addClass('coldest-slot');
  $('.half-circle-bottom').addClass('colder-hemisphere');
  $('.half-circle-bottom').css('animation-duration', season_duration + 's');
}

function switch_state()
{
  if (state === NORTH_SUMMER_STATE) {
    $('.half-circle-top').removeClass('coldest-hemisphere');
    $('.half-circle-top').addClass('hotter-hemisphere');

    $('.half-circle-bottom').removeClass('colder-hemisphere');
    $('.half-circle-bottom').addClass('hottest-hemisphere');

    $('.half-circle-top .slot').removeClass('coldest-slot');
    $('.half-circle-bottom .slot').addClass('hottest-slot');
    
    state = SOUTH_WINTER_STATE

  } else {
    $('.half-circle-top').addClass('coldest-hemisphere');
    $('.half-circle-top').removeClass('hotter-hemisphere');

    $('.half-circle-bottom').addClass('colder-hemisphere');
    $('.half-circle-bottom').removeClass('hottest-hemisphere');

    $('.half-circle-top .slot').addClass('coldest-slot');
    $('.half-circle-bottom .slot').removeClass('hottest-slot');
    
    state = NORTH_SUMMER_STATE
  }
  
  clearTimeout(season_timeout);
  
  if (season_duration > 1) {
    season_duration = season_duration - 0.5;
    season_timer = season_duration;
    
    init_season_timeout()

    $('.half-circle-top').css('animation-duration', season_duration + 's');
    $('.half-circle-bottom').css('animation-duration', season_duration + 's');

  } else if (state !== GAME_OVER_STATE) {
    state = GAME_OVER_STATE;
    clearTimeout(score_timeout);
    victory_bonus = BASE_DURATION * BASE_DURATION;
    trigger_game_over("...until they couldn't fly anymore. [Final score: " + (score_timer + victory_bonus) + "]");
  }
};

function init_season_timeout()
{
  season_timeout = setTimeout(
    () => {
      if (state !== GAME_OVER_STATE) {
        console.log(season_timer);
        if (season_timer > 0.5) {
          season_timer = season_timer - 0.5;
          init_season_timeout();
        } else {
          state = GAME_OVER_STATE;
          clearTimeout(score_timeout);
          trigger_game_over('One day, the temperature was too much for them, and their story ended abruptly... [Final score: ' + score_timer + ']');
        }
      }
    }, 
    500
  );
};

function trigger_game_over(text)
{
  $('.curtain p').html(text);
  $('.curtain').show();
};
