# Modules
about = require 'about'
sidebar = require 'home.sidebar'
$ = require '$'
t = require './home.tpl.html'

$ () ->
  about()
  sidebar()



