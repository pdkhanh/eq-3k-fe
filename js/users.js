let stocks = [];

async function loadUsers() {
  const response = await fetch("http://localhost:8080/api/stockDaily?date=2021-08-10", { mode: 'cors' });
  stocks = await response.json();
  userToTableRow();
}

function userToTableRow() {
  const tbody = document.querySelector("tbody");
  stocks.forEach(stock => {
    tbody.innerHTML += createRow(stock);
  });
}

function createPattern(patterns) {
  let spanElement = "";
  patterns.forEach(pattern => {
    spanElement += `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">${pattern}</span></br>`
  })
  return spanElement
}

function priceColor(price) {
  console.log(price)
  if (price > 6.5) return "violet"
  if (price > 0) return "green"
  if (price == 0) return "orange"
  return "red"
}

function addCommas(nStr) {
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}

function createRow(stock) {
  return `
  <tr>
    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
      <div class="flex items-center">
        <div class="flex-shrink-0 h-50 w-50">
          <img class="h-50 w-50" src="data:image/png;base64,${stock.image}" alt="" />
        </div>
        <div class="ml-4">
          <div id="fullName" class="text-sm leading-5 font-medium text-900" style="
          color: ${priceColor(stock.perChange)};">${addCommas(stock.price)} ${stock.change} ${stock.perChange}%</div>
          <div id="email" class="text-sm leading-5 text-black-500">${stock.code}</div>
          <div id="email" class="text-sm leading-5 text-black-500">${stock.name}</div>
        </div>
      </div>
    </td>
    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
    <div>
      ${createPattern(stock.pattern)}
      </div>
    </td>
    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
      <div class="text-sm leading-5 text-gray-900">${addCommas(stock.mTotalVol)}</div>
      <div class="text-sm leading-5 text-gray-500">${addCommas(stock.marketCap)}</div>
    </td>
    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
        ${stock.role}
    </td>
    <td class="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
      <a href="#" class="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline">Edit</a>
    </td>
  </tr>
  `;
}

loadUsers();