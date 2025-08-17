SELECT
    sessions.id,
    sessions.type,
    sessions.name,
    CAST(COUNT(cards.*) as INTEGER) AS card_count,
    cast(COUNT(DISTINCT cards."boosterId") as integer) AS booster_count
FROM sessions
         INNER JOIN cards ON sessions.id = cards."sessionId"
GROUP BY sessions.id, sessions.type, sessions.name;
