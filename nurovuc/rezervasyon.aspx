<%@ Page Language="VB" AutoEventWireup="false" CodeFile="rezervasyon.aspx.vb" Inherits="_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8"/>
    <title>Daffne Butik Otel</title>       
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="stylesheet" href="css/normalize.css"/>
    <link rel="stylesheet" href="css/main.css"/>
    <link rel="stylesheet" href="js/fancybox/source/jquery.fancybox.css"/>
    <script src="js/vendor/modernizr-2.6.2.min.js"></script>  
</head>
<body class="ana">
    <form id="form1" runat="server">
    <div>
     <div id="fb-root"></div>        
        <ul class="dil">
    		<li class="active"><a href="index.html">TR<i class="isaret"></i></a></li>
    		<li><a href="fr/index.html">EN</a></li>
        </ul>
		<nav id="mainnav" class="nl">
    		<div class="alt">
        		<a href="index.html" class="brand">Pastoriehof</a>
        		<div class="orangeline"></div>
        		<div id="navcontainer">
            		<ul>
                		<li class="anasayfa"><a href="index.html" title="Anasayfa">Anasayfa<div class="satir"></div></a></li>
                		<li class="hak"><a href="hak/hakkimizda.html">Hakkımızda<div class="satir"></div></a></li>
                        <li class="omgeving"><a href="hak/hakkimizda.html">Rezervasyon<div class="satir"></div></a></li>
                		<li class="omgeving"><a href="gal/galeri.html" title="Omgeving">GALERİ<div class="satir"></div></a></li>
                		<li class="contact last"><a href="nl/contact/index.html">İLETİŞİM<div class="satir"></div></a></li>        
            		</ul>
        		</div>	     
    		</div>
    		<a href="#" class="menu-btn open">Menu</a>
		</nav>                
        <section id="slider" class="flexslider">
            <ul class="slides">
                <li><img src="img/slayt/1.jpg" alt="Daffne butik otel"></li>
                <li><img src="img/slayt/2.jpg" alt="Daffne butik otel"></li>
                <li><img src="img/slayt/3.jpg" alt="Daffne butik otel"></li>           
            </ul>
        </section>
        <section id="mobile-ana">
            <div class="alt">
                <figure id="logo">
                    <img src="img/logo-daffne.fw.png" width="180" alt="Daffne Butik Otel">
                </figure>
            </div>
        </section>
        <section id="content">
            <div class="alt">
                <div id="features" class="clearfix">
                  <h2>Rezervasyon Yaptır</h2><br />
                  <table>
                      <tr>
                          <td>Ad Soyad:</td>
                          <td><asp:TextBox ID="TextBox1" runat="server"></asp:TextBox></td>
                      </tr>
                      <tr>
                          <td>Telefon:</td>
                          <td><asp:TextBox ID="TextBox2" runat="server"></asp:TextBox></td>
                      </tr>
                  </table>
                   
                   
                 
                   
                </div>
            </div>
        </section>
         <footer id="footer">
    <div class="alt">
        <a class="by" href="https://www.facebook.com/Daffnebutikotel/"><img src="img/facebook-ikon.png" width="23" height="23"/></a>
        <a class="t" href="https://twitter.com/DaffneButikOtel"><img src="img/twitter-ikon.png" width="23" height="23"/></a>
        <a class="t" href="https://www.instagram.com/daffnebutikotel/"><img src="img/instagram-ikon.png" width="23" height="23"/></a>
        <p>Her hakkı saklıdır © Kemalpaşa mahallesi Tarla sokak no:44 / Çanakkale - daffnebutikotel@gmail.com</p>
    </div>
    <div class="bottom"><div class="socials"></div></div>
</footer>

	<script src="../ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script>window.jQuery || document.write('<script src="js/vendor/jquery-1.9.1.min.js"><\/script>')</script>
	<script src="js/fancybox/source/jquery.fancybox.pack.js"></script>
<script src="js/plugins.js"></script>
<script src="js/main.js"></script> 
    </div>
    </form>
</body>
</html>
