-- @param {String} $1:setCode
select CAST(count(distinct cardidentifiers.scryfalloracleid) as integer) as count, cards.rarity from cards
    INNER JOIN cardidentifiers ON cards.uuid = cardidentifiers.uuid
WHERE cards.setcode = $1 AND cardIdentifiers.scryfalloracleid IS NOT NULL
GROUP BY cards.rarity
