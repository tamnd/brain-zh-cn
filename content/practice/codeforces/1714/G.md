---
title: "CF 1714G - 路径前缀"
description: "我们被要求处理一个有根树，每个边都有值。 每条边都有两个整数，$aj$ 和 $bj$。 对于每个非根节点$i$，我们考虑从根到$i$的路径。 令 $Ai$ 为这条路径上所有 $aj$ 的总和。"
date: "2026-06-09T20:09:15+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dfs-and-similar", "trees"]
categories: ["algorithms"]
codeforces_contest: 1714
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 811 (Div. 3)"
rating: 1700
weight: 1714
solve_time_s: 131
verified: false
draft: false
---

[CF 1714G - 路径前缀](https://codeforces.com/problemset/problem/1714/G)

 **评分：** 1700
 **标签：** 二分查找、数据结构、dfs 和类似、树
 **求解时间：** 2m 11s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求处理一个有根树，每个边都有值。 每条边有两个整数，$a_j$和$b_j$。 对于每个非根节点$i$，我们考虑从根到$i$。 让$A_i$是所有的总和$a_j$沿着这条路。 我们被要求找到$r_i$，该路径的最长前缀的长度使得总和$b_j$沿前缀不超过$A_i$。 前缀长度以边为单位进行测量，因此$r_i = 0$表示前缀中不能包含边。 

输入给出了多个测试用例，每个测试用例都描述一棵树$n$节点和$n-1$边，其中每条边都由父级定义$p_j$和两个成本$a_j$和$b_j$。 输出是一个数组$n-1$整数，每个非根节点一个。 

约束很严格：$n$可以达到$2 \cdot 10^5$，以及总和$n$所有测试用例也受$2 \cdot 10^5$。 显式地对每个节点的所有前缀求和的简单方法是$O(n^2)$，这太慢了。 我们需要一个与每个测试用例的节点数量呈线性或近线性的解决方案。 当所有情况都发生时，就会出现边缘情况$b_j$大于$A_i$对于一个节点，在这种情况下正确的前缀长度为零，并且当$A_i$完全匹配某些前缀和，必须小心处理以避免差一错误。 

## 方法

 暴力方法是重建从根到每个节点的路径$i$然后迭代所有前缀来计算总和$b_j$，当总和超过时停止$A_i$。 这是正确的，但需要$O(n^2)$在最坏的情况下运行，无法满足最大的约束。 

优化的关键观察是我们只需要前缀和$b_j$沿着从根开始的路径。 如果我们维护一个数组来存储累积和$b_j$沿着到当前节点的路径上的值，我们可以对这些和进行二分搜索，以找到其总和不超过的最长前缀$A_i$。 因为树是有根的，所以我们可以使用深度优先搜索来构建这些前缀和，将累积和从父级传播到子级。 每个二分查找操作需要$O(\log n)$，访问每个节点需要$O(1)$，导致总体$O(n \log n)$解决方案。 在 DFS 中使用列表来存储累积和可确保我们能够有效地访问祖先。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了|
 | DFS + 对前缀和进行二分查找 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个数组`prefix_b`存储累计总和$b_j$沿着从根开始的路径。 根节点的累积和为零。 维护一个数组`A`跟踪累计金额$a_j$从根源上。 
2. 将树构建为邻接列表，为每个子节点存储边缘值$a_j$和$b_j$。 这使得从根开始的 DFS 遍历变得容易。 
3. 从根目录启动DFS。 对于每个节点$u$访问、计算`A[u] = A[parent] + a_edge`，这是总和$a_j$沿着从根到的路径$u$。 
4. 保持`prefix_b`表示累积和的数组$b_j$沿着路径。 探望孩子时，附上`prefix_b[-1] + b_edge`递归 DFS 调用之前的数组。 
5. 计算$r_i$对于当前节点，执行二分查找`prefix_b`找到最右边的索引`idx`这样`prefix_b[idx] <= A[i]`。 该索引恰好是最长前缀的长度。 
6. 完成子节点的 DFS 后，弹出最后一个元素`prefix_b`回溯并恢复下一个兄弟的状态。 

为什么它有效：在每个节点，`prefix_b`数组存储累积和$b_j$沿着从根开始的路径。 因为树是有根的，路径是唯一的，数组是严格递增的。 对该数组进行二分搜索可确保我们找到满足总和约束的最长前缀。 DFS 遍历保证每个节点只被访问一次，并且前缀和反映正确的路径。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
import bisect

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        tree = [[] for _ in range(n + 1)]
        for j in range(2, n + 1):
            p, a, b = map(int, input().split())
            tree[p].append((j, a, b))

        A = [0] * (n + 1)
        res = [0] * (n + 1)
        prefix_b = [0]

        def dfs(u):
            for v, a_edge, b_edge in tree[u]:
                A[v] = A[u] + a_edge
                prefix_b.append(prefix_b[-1] + b_edge)
                # Binary search to find the longest prefix
                idx = bisect.bisect_right(prefix_b, A[v]) - 1
                res[v] = idx
                dfs(v)
                prefix_b.pop()

        dfs(1)
        print(" ".join(str(res[i]) for i in range(2, n + 1)))

if __name__ == "__main__":
    solve()
```DFS 维持`prefix_b`数组作为累积和$b_j$沿着路径到达当前节点。 二分查找用于有效地找到每个节点的最大前缀长度，并在访问子节点后弹出以恢复兄弟遍历的正确状态。 使用`bisect_right`确保我们处理前缀和等于的情况`A_i`正确。 

## 工作示例

 ### 示例 1

 | 节点| 节点路径 | A_i | 前缀_b | r_i |
 | --- | --- | --- | --- | --- |
 | 2 | 1→2 | 5 | [0,6]| 0 |
 | 3 | 1→2→3→4 | 19 | 19 [0,6,16,17] | 3 |
 | 4 | 1→2→3 | 14 | 14 [0,6,16]| 1 |
 | 5 | 1→2→3→5 | 16 | 16 [0,6,16,17] | 2 |

 该表确认了具有累积和的 DFS 为每个节点生成了正确的最长前缀长度。 

### 示例 2

 | 节点| 节点路径 | A_i | 前缀_b | r_i |
 | --- | --- | --- | --- | --- |
 | 2 | 1→2 | 1 | [0,100]| 0 |
 | 3 | 1→2→3 | 2 | [0,100,101] | 0 |
 | 4 | 1→2→3→4 | 103 | 103 [0,100,101,102] | 3 |

 这显示了第一个边缘的边缘情况$b_j > A_i$处理正确，给出前缀长度 0。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | DFS访问每个节点一次，每个节点二分查找需要log(深度)，总O(n log n) |
 | 空间| O(n) | 树邻接表、累加和数组和结果数组 |

 该算法非常适合 2 秒时间限制和 256 MB 内存约束，因为$n \le 2\cdot 10^5$每个节点仅贡献 log(n) 操作。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided samples
assert run("""4
9
1 5 6
4 5 1
2 9 10
4 2 1
1 2 1
2 3 3
6 4 3
8 1 3
4
1 1 100
2 1 1
3 101 1
4
1 100 1
2 1 1
3 1 101
10
1 1 4
2 3 5
2 5 1
3 4 3
3 1 5
5 3 5
5 2 1
1 3 2
6 2 1
""") == "0 3 1 2 1 1 2 3\n0 0 3\n1 2 2\n0 1 2 1 1 2 2 1 1",
```
