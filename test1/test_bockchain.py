import io
import unittest
from contextlib import redirect_stdout
from unittest.mock import patch

from bockchain import Block, Blockchain, Node


class BlockChainTests(unittest.TestCase):
    def test_block_hash_is_stable(self):
        block = Block(1, [{"from": "Alice", "to": "Bob", "amount": 10}], 1234567890.0, "abc")

        self.assertEqual(block.hash, block.calculate_hash())

    def test_mining_adds_valid_block_and_reward_transaction(self):
        blockchain = Blockchain()
        blockchain.difficulty = 2
        blockchain.add_transaction("Alice", "Bob", 10)

        with patch("bockchain.time.time", return_value=1234567890.0):
            with redirect_stdout(io.StringIO()):
                blockchain.mine_pending_transactions("Miner1")

        self.assertEqual(len(blockchain.chain), 2)
        self.assertTrue(blockchain.is_chain_valid())
        self.assertEqual(blockchain.pending_transactions, [{
            "from": "system",
            "to": "Miner1",
            "amount": blockchain.mining_reward,
        }])

    def test_node_mine_propagates_block_to_peer(self):
        node_a = Node("Node A")
        node_b = Node("Node B")
        node_a.add_peer(node_b)

        node_a.blockchain.difficulty = 2
        node_b.blockchain.difficulty = 2
        node_a.broadcast_transaction("Alice", "Bob", 10)

        with patch("bockchain.time.time", return_value=1234567890.0):
            with redirect_stdout(io.StringIO()):
                node_a.mine()

        self.assertEqual(len(node_a.blockchain.chain), 2)
        self.assertEqual(len(node_b.blockchain.chain), 2)
        self.assertTrue(node_a.blockchain.is_chain_valid())
        self.assertTrue(node_b.blockchain.is_chain_valid())


if __name__ == "__main__":
    unittest.main()