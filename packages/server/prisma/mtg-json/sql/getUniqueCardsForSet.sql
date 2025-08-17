-- @param {String} $1:setCode
select distinct cardidentifiers.scryfalloracleid, cards.setcode, cards.number, cards.uuid
from cards
    INNER JOIN cardidentifiers ON cards.uuid = cardidentifiers.uuid
WHERE cards.setcode = $1
    AND cardIdentifiers.scryfalloracleid is not null
