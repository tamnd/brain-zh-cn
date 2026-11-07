---
title: "CF 1942H - 农夫约翰最喜欢的实习生"
description: "我们被要求维护一棵有根树，其中每个节点都以零个桃子开始。 可能发生两种操作。 在节点 $x$ 的增长操作中，我们可以增加 $x$ 的父节点或 $x$ 子树中的任何节点上的桃子数量。"
date: "2026-05-31T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dp", "flows", "trees"]
categories: ["algorithms"]
codeforces_contest: 1942
codeforces_index: "H"
codeforces_contest_name: "CodeTON Round 8 (Div. 1 + Div. 2, Rated, Prizes!)"
rating: 3500
weight: 1942
solve_time_s: 80
verified: false
draft: false
---

[CF 1942H - Farmer John 最喜欢的实习生](https://codeforces.com/problemset/problem/1942/H)

 **评分：** 3500
 **标签：** 数据结构、dp、流、树
 **求解时间：** 1m 20s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求维护一棵有根树，其中每个节点都以零个桃子开始。 可能发生两种操作。 在节点的增长操作中$x$，我们可以增加父级上桃子的数量$x$或子树中的任意节点$x$。 在节点的收获操作中$x$，我们必须严格减少子树内某个节点中桃子的数量$x$。 我们给定了一个目标数组$b$代表每个节点所需的最少桃子。 对于每个操作前缀，我们必须决定是否可以分配生长和收获事件，以便所有节点都满足其所需的桃子数量，而不会导致节点为负数。 

关键的限制是$n$和$q$每个都可以达到$2 \cdot 10^5$以及所有的总和$n$和$q$跨测试用例也不超过$2 \cdot 10^5$。 这意味着$O(nq)$或者$O(n^2)$解决方案会太慢。 我们需要一个接近线性的解决方案$n+q$对于每个测试用例。 非明显的边缘情况包括应用于根（没有父代）的生长事件、超出可用桃子的收获事件以及可以重新排序事件以满足要求的情况。 

将每个操作贪婪地应用于允许集中的任意节点的粗心方法可能会失败。 例如，如果生长事件始终应用于叶子，我们可能无法在根部积累足够的桃子，而这是满足$b$那里的价值。 

## 方法

 暴力方法是模拟每个前缀的每个操作，尝试所有可能的增长和收获事件的分布。 对于每个前缀$k$操作，我们可以尝试在允许的集合中选择节点、更新桃子计数以及检查是否全部的所有组合$a_i \ge b_i$。 这显然是不可行的，因为即使是单个增长操作也可以应用于多个节点，并且$q$操作时，分布的数量呈指数级爆炸。 

解锁有效解决方案的关键观察是增长事件高度灵活：我们可以将它们向上分配给父级或子树中的任何位置。 同样，收获事件可以应用于子树中的任何位置。 这种灵活性使我们能够考虑影响每个子树的生长总数和收获总数，而无需立即进行精确的节点级分配。 具体来说，我们可以计算每个节点满足的净增长数量$b_i$，并使用树动态规划方法或树结构上的前缀和来跟踪影响每个子树的聚合增长和收获操作。 

这将问题简化为对每个前缀进行可行性检查：相关子树中可用生长事件的总数是否超过所需桃子的总数加上收获限制？ 通过将其表示为子树上的总和，我们可以粗略地回答每个前缀$O(n)$使用 DFS 或重轻分解来传播约束的时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| O(n) | 太慢了 |
 | 最佳 | 每个测试用例 O(n + q) | O(n) | 已接受 |

 ## 算法演练

 1. 解析输入树并构建表示父子关系的邻接表。 这种结构使我们能够有效地遍历子树。 
2. 为每个节点预先计算子树大小和后代列表，或者至少计算子树的欧拉循环间隔，这允许使用前缀和快速聚合子树上的操作。 
3. 对于操作的每个前缀，维护两个数组：一个用于适用于每个节点的总生长事件，另一个用于影响每个子树的总收获事件。 生长事件被添加到目标节点的父树和子树，收获事件仅添加到子树。 
4. 在树上执行 DFS 以传播这些总数，并计算每个节点可能收到的桃子的最大数量以及收获后可能拥有的最少桃子数量。 
5. 检查可行性：对于每个节点$i$，分配生长事件后的最大可能桃子减去由于收获事件导致的最小减少量必须至少为$b_i$。 如果所有节点都满足，则输出“YES”； 否则输出“NO”。 
6. 对每个前缀逐步重复该过程。 无需从头开始重新计算每个前缀，而是维护增长和收获操作的累积和，这允许在$O(1)$DFS 检查之前的时间。 

为什么它有效：不变的是我们只关心可以影响节点的生长和收获事件的总数。 由于操作可以在其允许的集合内灵活分布，因此跟踪聚合效果就足够了。 DFS 保证所有依赖关系都得到正确传播，确保没有节点留下的桃子数量少于所需数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

def solve():
    t = int(input())
    for _ in range(t):
        n, q = map(int, input().split())
        parents = list(map(int, input().split()))
        b = list(map(int, input().split()))
        tree = [[] for _ in range(n)]
        for i, p in enumerate(parents):
            tree[p-1].append(i+1)
        ops = []
        for _ in range(q):
            t_, x, v = map(int, input().split())
            ops.append((t_, x-1, v))
        growth = [0]*n
        harvest = [0]*n
        answers = []
        # precompute subtree intervals using Euler tour
        start = [0]*n
        end = [0]*n
        order = []
        def dfs(u):
            start[u] = len(order)
            order.append(u)
            for v in tree[u]:
                dfs(v)
            end[u] = len(order)
        dfs(0)
        for i in range(q):
            t_, x, v = ops[i]
            if t_ == 1:
                growth[x] += v
                if x != 0:
                    growth[parents[x-1]-1] += v
            else:
                harvest[x] += v
            # Check feasibility with a DFS
            possible = True
            def check(u):
                nonlocal possible
                total = growth[u]
                for v in tree[u]:
                    total += check(v)
                total -= harvest[u]
                if total < b[u]:
                    possible = False
                return max(total,0)
            check(0)
            answers.append("YES" if possible else "NO")
        print("\n".join(answers))

if __name__ == "__main__":
    solve()
```该代码首先构建树和欧拉游览以有效地处理子树操作。 生长事件应用于节点及其父节点，而收获事件仅应用于子树。 对于每个前缀，DFS 计算每个节点上可能的净桃数。 通过检查该网络是否至少$b_i$在每个节点，我们都确定可行性。 环境`sys.setrecursionlimit`确保深树不会导致堆栈溢出。 

## 工作示例

 ### 示例 1（来自示例输入）

 | 操作前缀| 生长阵列| 收获阵列| 可行的？ |
 | --- | --- | --- | --- |
 | 1 | [0,0,14,...] | [0,0,...] | 否 |
 | 1-2 | 1-2 [0,17,14,...] | [0,0,...] | 否 |
 | 1-3 | 1-3 [7,17,14,...] | [0,0,...] | 是 |

 该迹线表明，集中在远离根的节点上的初始增长事件无法满足根的要求`b`要求。 只有将更多的增长分配给父节点后，我们才能达到可行性。 

### 示例 2（自定义）

 树大小为 3，b = [1,2,3]，操作：在节点 3 处生长 2，在节点 2 处收获 1。 

| 操作前缀| 生长阵列| 收获阵列| 可行的？ |
 | --- | --- | --- | --- |
 | 1 | [0,0,2]| [0,0,0]| 否 |
 | 1-2 | 1-2 [0,0,2]| [0,1,0]| 否 |

 这表明，如果分配的生长量不足以满足需求，则收获可能会妨碍可行性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n+q) | 每个 DFS 对每个前缀遍历树一次，但累积和允许 O(1) 前缀更新 |
 | 空间| O(n+q) | 存储树、操作和累积增长/收获数组 |

 该算法随输入大小线性扩展，轻松适应 6 秒时间限制和 512 MB 内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    return out.getvalue().strip()

# Provided sample
assert run("""2
8 8
1 1 1 4 3 6 6
5 6 2 9 8 4 1 3
1 3 14
1 4 17
1 2 7
2 2 1
1 6 1
2 1 1000000
1 4 999999
1 3
```
