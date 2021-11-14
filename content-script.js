function trim(text) {
  return $.trim(text.replace(/\s\s+/g, " "));
}

function getCurrentCategory() {
  const breadcrumbsCategoryLink = $("#m__breadcrumbs a").last()[0];
  const match = breadcrumbsCategoryLink?.href?.match(
    /^https:\/\/999.md\/ro\/list\/(?<category>.+)/
  );

  if (!match) return null;

  return match.groups.category;
}

function getListedPrice() {
  const priceBlock = $(
    ".adPage__content__price-feature__prices__price.is-main"
  ).first();

  if (!priceBlock) return null;

  const value = priceBlock
    .find(".adPage__content__price-feature__prices__price__value")
    .attr("content");
  const currency = priceBlock
    .find(".adPage__content__price-feature__prices__price__currency")
    .attr("content");

  if (!(value && currency)) return null;

  return { value: parseInt(value), currency: currency };
}

function getAdvertType() {
  const text = $(".adPage__aside__stats__type").text();
  const match = text?.match(/^Tipul: (?<type>.+)$/);

  if (!match) return null;

  return match.groups.type;
}

function getFeatureByName(name) {
  const featureValue = $(`.adPage__content__features__key:contains('${name}')`)
    .next()
    .text();

  if (!featureValue) return null;

  return trim(featureValue);
}

function getTotalArea() {
  const areaString = getFeatureByName("Suprafață totală");
  const match = areaString?.match(/^(?<area>\d+) m²$/);

  if (!match) return null;

  const area = match.groups.area;

  return parseInt(area);
}

function calcPricePerSquareMeter(totalPrice, totalArea) {
  return Math.round(totalPrice / totalArea);
}

window.onload = function () {
  if (getCurrentCategory() === "real-estate/apartments-and-rooms") {
    if (getAdvertType() === "Vând") {
      const listedPrice = getListedPrice();
      const totalArea = getTotalArea();

      if (listedPrice && totalArea) {
        const pricePerm2 = calcPricePerSquareMeter(
          listedPrice.value,
          totalArea
        );
        const perM2PriceElement = `
          <div style="margin: 16px 0;">
            <div class="adPage__content__price-feature__title">Preț m²:</div>
            <ul class="adPage__content__price-feature__prices">
              <li class="adPage__content__price-feature__prices__price" style="color: purple;">
                <span class="adPage__content__price-feature__prices__price__value">${pricePerm2}</span>
                <span class="adPage__content__price-feature__prices__price__currency">${listedPrice.currency}</span>
              </li>
            </ul>
          </div>
        `;

        $(perM2PriceElement).insertAfter(".adPage__content__price-feature");
      }
    }
  }
};
