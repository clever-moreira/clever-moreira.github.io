import unittest
from decimal import Decimal
from main import Processor, Record, TransientError, validate, with_retry


class PipelineTests(unittest.TestCase):
    def test_validation(self):
        self.assertEqual(validate({"ticket_id": " X ", "amount": "3.40"}),
                         Record("X", Decimal("3.40")))
        with self.assertRaises(ValueError):
            validate({"ticket_id": "X", "amount": "-5"})

    def test_duplicate_is_not_reprocessed(self):
        calls = []
        def action(record):
            calls.append(record.ticket_id)
            return "ok"
        worker = Processor(action)
        self.assertEqual(worker.run({"ticket_id": "A", "amount": "1"})["status"], "processed")
        self.assertEqual(worker.run({"ticket_id": "A", "amount": "1"})["status"], "duplicate")
        self.assertEqual(calls, ["A"])

    def test_retry_transient_error(self):
        attempts = []
        def action():
            attempts.append(1)
            if len(attempts) < 3:
                raise TransientError()
            return "done"
        self.assertEqual(with_retry(action, sleep=lambda _: None), "done")
        self.assertEqual(len(attempts), 3)

    def test_permanent_transient_error(self):
        with self.assertRaises(TransientError):
            with_retry(lambda: (_ for _ in ()).throw(TransientError()), attempts=2,
                       sleep=lambda _: None)


if __name__ == "__main__":
    unittest.main()
