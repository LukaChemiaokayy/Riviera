# Demo-ს გაკეთება (5 წუთი)
1. დააკოპირე საქაღალდე -> `restaurant-X`. ჩაუდე შენი `style.css` გვერდით (fixes.css უკვე აქაა).
2. `assets/` -> ჩადე `logo.webp`.
3. `config.js` -> შეცვალე name, phone, sheetUrl, about ტექსტები, (სურვილისამებრ theme ფერები).
4. გახსენი index.html (ან ატვირთე Netlify/Vercel/GitHub Pages-ზე). QR: `https://domain/?table=5`.

# რეალური შეკვეთები (კლიენტის დამტკიცების მერე) — ტოკენი სერვერზე
Apps Script-ში (იმავე პროექტში, სადაც doGet გაქვს) დაამატე:
Project Settings -> Script properties: TG_TOKEN, TG_CHAT

function doPost(e){
  const d = JSON.parse(e.postData.contents);
  const p = PropertiesService.getScriptProperties();
  const text = d.type === 'waiter'
    ? '🔔 Waiter — table ' + d.table
    : '🍽️ Table ' + d.table + '\n' + d.items.map(i => '• ' + i.name + ' x' + i.qty + ' — ' + i.price*i.qty).join('\n') + '\n💰 ' + d.total;
  UrlFetchApp.fetch('https://api.telegram.org/bot' + p.getProperty('TG_TOKEN') + '/sendMessage', {
    method: 'post', contentType: 'application/json',
    payload: JSON.stringify({ chat_id: p.getProperty('TG_CHAT'), text: text })
  });
  return ContentService.createTextOutput('ok');
}
Deploy -> Manage deployments -> New version. შემდეგ config.js-ში: orderEndpoint = ის /exec URL.
