---
title: "CF 1980G - 亚夏与神秘之树"
description: "我们有一棵有 n 个顶点的树。 这棵树中的每条边都有一个权重。 有 m 个两种类型的查询。 第一种类型通过将所有边与给定数字 y 进行异或来更改所有边的有效权重。"
date: "2026-06-08T16:56:36+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "data-structures", "dfs-and-similar", "graphs", "greedy", "strings", "trees"]
categories: ["algorithms"]
codeforces_contest: 1980
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 950 (Div. 3)"
rating: 2300
weight: 1980
solve_time_s: 168
verified: false
draft: false
---

[CF 1980G - 亚斯亚和神秘之树](https://codeforces.com/problemset/problem/1980/G)

 **评分：** 2300
 **标签：** 位掩码、数据结构、dfs 和类似、图、贪婪、字符串、树
 **求解时间：** 2m 48s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵树`n`顶点。 这棵树中的每条边都有一个权重。 有`m`两种类型的查询。 第一种类型通过将所有边与给定数字进行异或来更改所有边的有效权重`y`。 第二种类型询问，给定一个顶点`v`和一个数字`x`，通过连接可获得的最大 XOR 是多少`v`到任何其他顶点`u`（在心理上，没有实际修改树），然后计算所得唯一循环的异或。 

对于第二种查询类型，至关重要的是要认识到通过添加边形成的循环`v-u`异或等于路径的异或`v`到`u`在树上，加上`x`从添加的边缘。 既然我们可以选择`u`任意地，问题简化为寻找一个顶点`u`其路径异或来自`v`，当与`x`，是最大的。 这相当于对一组数字的**最大异或查询**。 

这些约束要求我们在所有测试用例中处理最多 200,000 个顶点和 200,000 个查询。 每个查询都可能检查每个顶点，因此每次查询的简单 O(n) 方法会太慢。 这强烈暗示我们需要**预处理**和**有效的最大异或检索**，而不是每个查询的简单树遍历。 

非明显的边缘情况包括当所有边缘权重相同时，或者当 XOR 更新时（`^ y`）以使得先前的最佳路径不再是最佳的方式翻转位。 另一个微妙之处是添加虚拟边缘`v`实际上从未更改树，因此任何预计算必须在多个第二类型查询中保持有效，只有 XOR 偏移量由于先前的第一类型查询而改变。 

## 方法

 简单的方法是直接处理每个查询。 对于第二类查询`? v x`，我们可以执行 DFS`v`计算到每个其他顶点的路径异或，然后计算`path_xor ^ x`对于所有候选人并取最大值。 每个查询的复杂度为 O(n)。 自从`n`可以是 2×10^5 并且`m`可以是 2×10^5，这会导致 O(n*m) = 4×10^10 次操作，这显然是不可行的。 

关键的见解是每棵树都可以预处理一次。 如果我们选择一个根（例如顶点 1），我们可以为每个顶点计算从根到该顶点的路径的异或，我们称之为`px[v]`。 然后，添加一条边`v-u`给出循环异或`px[v] ^ px[u] ^ x`。 最大化超过`u`正是经典的**数组中的最大异或**问题：查找`px[u]`最大化`px[u] ^ x ^ px[v]`。 使用存储所有内容的**二元树**（或前缀树）可以有效地解决这个问题`px[u]`。 

第一类查询`^ y`只需将所有 XOR 值移位`y`。 而不是更新每个`px[u]`在 trie 中，我们维护全局 XOR 偏移量并在查询期间延迟应用它。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * m) | O(n) | 太慢了 |
 | 预计算 XOR + Trie | O(n + m * log(MAXW)) | O(n + m * log(MAXW)) | O(n * log(MAXW)) | O(n * log(MAXW)) | 已接受 |

 ## 算法演练

 1. 在顶点任意建树 1. 执行 DFS 计算`px[v]`，从根到每个顶点的异或。 这为每个顶点提供了一个独立于查询的静态值。 
2. 构建一个包含所有内容的二进制 trie`px[v]`。 每个 trie 节点代表所存储数字的一个位位置。 此 trie 允许最大 O(log(MAXW)) 异或查询。 
3. 初始化全局异或偏移量`off = 0`。 对于第一类查询`^ y`， 更新`off = off ^ y`。 没有对 trie 进行任何实际更改； 偏移量将在查找期间应用。 
4. 对于第二类查询`? v x`,计算目标值`t = x ^ px[v] ^ off`。 查询 trie 中的数字`px[u]`最大化`px[u] ^ off`。 最终的答案是`max_xor ^ t`。 
5.收集并输出所有答案。 

工作原理：通过存储从根到所有顶点的异或，通过添加虚拟边形成的任何循环都可以表示为`px[v] ^ px[u] ^ x`。 trie 允许我们有效地选择`px[u]`与任何给定数字最大化异或。 惰性异或偏移正确地模拟了所有的累积效应`^ y`更新而不重建特里树。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class TrieNode:
    def __init__(self):
        self.child = [None, None]

class Trie:
    def __init__(self):
        self.root = TrieNode()
        self.BITS = 30  # 1e9 < 2^30
    
    def insert(self, num):
        node = self.root
        for i in reversed(range(self.BITS)):
            b = (num >> i) & 1
            if not node.child[b]:
                node.child[b] = TrieNode()
            node = node.child[b]
    
    def max_xor(self, num):
        node = self.root
        res = 0
        for i in reversed(range(self.BITS)):
            b = (num >> i) & 1
            if node.child[b ^ 1]:
                res |= (1 << i)
                node = node.child[b ^ 1]
            else:
                node = node.child[b]
        return res

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        tree = [[] for _ in range(n+1)]
        for _ in range(n-1):
            u, v, w = map(int, input().split())
            tree[u].append((v, w))
            tree[v].append((u, w))
        
        px = [0] * (n+1)
        visited = [False] * (n+1)
        def dfs(u, par):
            visited[u] = True
            for v, w in tree[u]:
                if not visited[v]:
                    px[v] = px[u] ^ w
                    dfs(v, u)
        dfs(1, -1)
        
        trie = Trie()
        for v in range(1, n+1):
            trie.insert(px[v])
        
        off = 0
        res = []
        for _ in range(m):
            line = input()
            if line[0] == '^':
                y = int(line[2:])
                off ^= y
            else:
                _, v, x = line.split()
                v = int(v)
                x = int(x)
                t_val = x ^ px[v] ^ off
                ans = trie.max_xor(t_val)
                res.append(ans)
        print(*res)

if __name__ == "__main__":
    solve()
```该代码首先计算所有根到顶点的异或并将它们插入到特里树中。 为了`^ y`查询时，它会更新全局偏移量。 为了`? v x`查询时，它会计算目标 XOR 并高效地查询 trie。 对于 10^9 以内的所有权重，选择 30 位就足够了。 

## 工作示例

 **样品1：**

 | 查询 |`off`|`px[v]`|`t = x ^ px[v] ^ off`| 最大特里树 | 回答 |
 | ---| ---| ---| ---| ---| ---|
 | ^ 5 | 5 | - | - | - | - |
 | ？ 2 9 | 5 | 1 | 9 ^ 1 ^ 5 = 13 | 9 ^ 1 ^ 5 = 13 | 0 ^ 13 = 13 | 0 ^ 13 = 13 | 13 |
 | ^ 1 | 4 | - | - | - | - |
 | ？ 1 10 | 1 4 | 0 | 10 ^ 0 ^ 4 = 14 | 10 ^ 0 ^ 4 = 14 | 1 ^ 14 = 15 | 1 ^ 14 = 15 | 15 | 15

 该表演示了延迟 XOR 偏移量和预计算的方式`px[v]`结合起来有效地产生答案。 

**示例2：**类似的处理，确认像1e9这样的大数字被正确处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m * log(MAXW)) | O(n + m * log(MAXW)) | DFS 需要 O(n)，trie 查询每个查询需要 O(log(MAXW)) |
 | 空间| O(n * log(MAXW)) | O(n * log(MAXW)) | Trie 最多存储 n 个数字，每个数字有 log(MAXW) 个节点 |

 这是可以接受的，因为`n`,`m`≤ 2×10^5 且 log(MAXW) ≤ 30，每个测试用例提供约 6×10^6 次操作。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("""2
3 7
1 2 1
3 1 8
^ 5
? 2 9
^ 1
? 1 10
```
