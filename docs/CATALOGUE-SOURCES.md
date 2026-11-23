# Catalogue sources and artwork

Verified on 23 November 2026. These records are a small curated sample catalogue for an independent portfolio demo. They are not a live inventory, buying guide, or statement of availability. Descriptions were written for this project; brand names identify the subjects and do not imply affiliation or endorsement.

All images in `public/watches/` are original SVG illustrations created for Horlo. They are stylized representations, not product photographs or exact reproductions. No manufacturer photography or logo artwork is included. Their hands and digital displays are decorative, not live clocks.

| Watch                           | Reference           | Primary source                                                                                                                                                                        |
| ------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rolex Submariner                | 124060              | [Manufacturer specification](https://www.rolex.com/watches/submariner/m124060-0001)                                                                                                   |
| Omega Speedmaster Moonwatch     | 310.30.42.50.01.002 | [Manufacturer specification](https://media.omegawatches.com/documents/manuals/31030425001002_User_Manual_EN.pdf)                                                                      |
| Grand Seiko Snowflake           | SBGA211             | [Manufacturer specification](https://www.grand-seiko.com/us-en/collections/SBGA211G)                                                                                                  |
| Cartier Tank Must               | WSTA0106            | [Manufacturer specification](https://int.cartier.com/en/collections/watches/choose-your-watch/by-material/steel-watches/wsta0106-tank-must-de-cartier-watch.html)                     |
| Tudor Black Bay 58              | 79030B              | [Manufacturer specification](https://media.tudorwatch.com/image/upload/fl_attachment/v1/tudorwatch/pressroom/products/black-bay-58/pdf/tudor2020-blackbayfifty-eight-navyblue-es.pdf) |
| Casio A168                      | A168WA-1            | [Manufacturer specification](https://www.casio.com/in/watches/casio/product.A168WA-1/)                                                                                                |
| Hamilton Khaki Field Mechanical | H69439931           | [Manufacturer specification](https://www.hamiltonwatch.com/en-us/h69439931-khaki-field-mechanical.html)                                                                               |
| NOMOS Tangente                  | 139                 | [Manufacturer specification](https://nomos-glashuette.com/en-de/tangente/tangente-139)                                                                                                |

## Data conventions

- Case measurements and water-resistance ratings come from the manufacturer sources above. Round models use case diameter. For the rectangular Cartier and Casio, `diameter` stores case width and `caseSizeLabel` supplies the full length × width display.
- `waterResistance` is expressed in nominal metres where the manufacturer supplies a numeric rating. It is a specification, not advice about suitable activities.
- Casio does not give this A168 a depth rating. Its numeric value of `0` is an internal sentinel for an unspecified rating; the UI must display `waterResistanceLabel`, never “0 m.”
- NOMOS currently lists reference 139 at 5 atm and describes it as splash-proof. This data follows that current page rather than older 3 atm technical sheets. The label preserves the manufacturer's qualification.
- The Omega reference uses the sapphire-crystal, steel-bracelet variant documented in its official manual. Cartier WSTA0106 is the large quartz model on a steel bracelet. Tudor 79030B is the navy-blue Black Bay 58 from the official product sheet.
- No prices, investment claims, owner identities, or real collector records are included.
