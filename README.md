<h1 align="center">
  <br>
  <img
    src="https://github.com/skyportal/skyportal/raw/master/static/images/skyportal_logo.png"
    alt="SkyPortal Logo"
    width="100px"
  />
  <br>
  SkyPortal
  <br>
</h1>

<h2 align="center">
An Astronomical Data Platform
</h2>

<p>
  <span style="font-size: 180%;">
  Please see the <a href="https://skyportal.io">project homepage</a> for more information.
  </span>
</p>

<p>
  <a style="border-width:0" href="https://doi.org/10.21105/joss.01247">
    <img src="http://joss.theoj.org/papers/10.21105/joss.01247/status.svg" alt="DOI badge" >
  </a>
</p>

## Installation & Usage

Please refer to the <a href="https://skyportal.io/docs">project documentation</a>.

This version has been modified to add a make command that allows to load data from grandma's owncloud into SkyPortal.
It should be used ONLY by Grandma collaboration member's with an access to Grandma's owncloud.

This is the added command : make seed_grandma PARAMS='"owncloud_username" "owncloud_password"'
