# Running This Project

I want this project to run all the time. So I used the built-in version of `apachectl` with MacOS.

```bash
sudo apachectl start
```

Then edit `/etc/apache2/httpd.conf` with:

```bash
sudo vim /etc/apache2/httpd.conf
```

And change the lines with `/Library/Weserver/Documents` to whatever folder you want (I'm using `/Users/samstevens/Sites` because it seems quite central.)

Then restart apache with


```bash
sudo apachectl restart
```

And then I copied `dist` to `/Users/samstevens/Sites` and renamed it `youtube`, then visited http://localhost/youtube and it worked!

```bash
rm -rf ~/Sites/youtube
cp -r ./dist ~/Sites
mv ~/Sites/dist ~/Sites/youtube
open http://localhost/youtube
```

Then I set [Leechblock](https://www.proginosko.com/leechblock/) to redirect to http://localhost/youtube. Easy.