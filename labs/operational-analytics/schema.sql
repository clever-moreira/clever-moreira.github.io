CREATE TABLE execution (
    id INTEGER PRIMARY KEY,
    process_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('success', 'business_error', 'system_error')),
    started_at TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL CHECK(duration_seconds >= 0)
);
INSERT INTO execution VALUES
(1,'Invoice Processing','success','2026-01-01T09:00:00',34),
(2,'Invoice Processing','success','2026-01-01T09:10:00',31),
(3,'Invoice Processing','business_error','2026-01-01T09:20:00',18),
(4,'Contract Review','success','2026-01-01T10:00:00',80),
(5,'Contract Review','system_error','2026-01-01T10:10:00',42),
(6,'Contract Review','success','2026-01-01T10:20:00',74);
