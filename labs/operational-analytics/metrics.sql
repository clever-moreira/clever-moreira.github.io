SELECT
    process_name,
    COUNT(*) AS executions,
    SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) AS successes,
    ROUND(100.0 * SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) / COUNT(*), 1) AS success_rate_pct,
    ROUND(AVG(duration_seconds), 1) AS avg_duration_sec
FROM execution
GROUP BY process_name
ORDER BY process_name;
