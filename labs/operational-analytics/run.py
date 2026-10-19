"""Relatório SQL de execuções sintéticas; roda localmente."""
import sqlite3
from pathlib import Path

folder = Path(__file__).parent
with sqlite3.connect(":memory:") as connection:
    connection.executescript((folder / "schema.sql").read_text(encoding="utf-8"))
    query = (folder / "metrics.sql").read_text(encoding="utf-8")
    rows = connection.execute(query)
    print("process | executions | successes | success_rate_pct | avg_duration_sec")
    for row in rows:
        print(" | ".join(map(str, row)))
