import * as cheerio from 'cheerio';

async function test() {
  try {
    const res = await fetch('http://www.funvisis.gob.ve/index.php');
    const html = await res.text();
    const $ = cheerio.load(html);
    
    console.log('Iframes:', $('iframe').length);
    $('iframe').each((i, el) => {
      console.log('iframe src:', $(el).attr('src'));
    });
    
    console.log('Scripts:', $('script').length);
    $('script').each((i, el) => {
      const src = $(el).attr('src');
      if (src) console.log('script src:', src);
      const content = $(el).html();
      if (content && (content.includes('sismo') || content.includes('ajax'))) {
         console.log('inline script with sismo/ajax:', content.substring(0, 200));
      }
    });
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
