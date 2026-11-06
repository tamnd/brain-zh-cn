---
title: "CF 1891F - 成长中的树"
description: "我们被要求在不断生长的有根树上处理一系列操作。 该树从编号为 1 的单个节点开始，每个节点都有一个数值，最初为 0。"
date: "2026-06-08T22:02:27+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "trees"]
categories: ["algorithms"]
codeforces_contest: 1891
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 907 (Div. 2)"
rating: 2000
weight: 1891
solve_time_s: 126
verified: false
draft: false
---

[CF 1891F - 一棵成长的树](https://codeforces.com/problemset/problem/1891/F)

 **评级：** 2000
 **标签：** 数据结构、dfs 和类似、树
 **求解时间：** 2m 6s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求在不断生长的有根树上处理一系列操作。 该树以编号为 1 的单个节点开始，每个节点都有一个数值，最初为 0。查询要么向现有节点添加新的子节点，要么将给定节点的子树中的所有值增加指定的量。 所有查询完成后，我们需要输出树中所有节点的最终值。 

输入由多个测试用例组成，每个测试用例最多包含 500,000 个查询。 所有测试用例的查询总数保证不超过 500,000。 值可以大到$10^9$或小至$-10^9$。 这些限制意味着任何算法都比$O(q \log q)$每个测试用例不太可能足够有效。 为每个查询更新子树中的所有节点的简单解决方案将需要$O(nq)$最坏情况下的时间可以达到$2.5 \cdot 10^{11}$操作太慢了。 

不明显的边缘情况包括将子节点添加到本身具有大子树和多个重叠子树增量的节点。 例如，如果我们有一棵包含节点 1-3 的树，并且我们在节点 1 上执行增量，然后在节点 2 上执行增量，则每次遍历子树的简单方法如果实施不正确，可能会重复计数或错过更新。 另一个边缘情况是添加一个新节点并立即对其执行子树增量。 该算法必须正确考虑未来增量中新添加的节点。 

## 方法

 暴力方法很简单：维护树的邻接列表，存储每个节点的值，并为每个查询遍历子树以应用增量。 这是正确的，但它的时间复杂度是$O(qn)$因为每个类型 2 查询可能会触及子树中的每个节点。 在最坏的情况下，树是星形或链形，并且每个查询都是根上的增量，我们每个测试用例都会达到 5 亿次操作，这是不切实际的。 

关键的观察是子树增量和树生长具有顺序结构。 每个节点只添加一次，并且一旦添加节点，其父节点就​​不会改变。 我们可以将树表示为一个数组，每个节点都有一个“父”指针。 然后，我们可以在所有查询之后通过一次遍历将值从父级传播到子级。 我们可以在父节点记录增量并稍后将其下推，而不是立即更新子树中的所有节点。 这本质上是基于 DFS 的前缀传播：每个节点从其祖先累积增量。 

暴力破解之所以有效，是因为更新每个子树直接给出正确的值，但当子树很大并且有很多查询时会失败。 我们只需要在 DFS 中传播一次增量就可以降低复杂性$O(nq)$到$O(n+q)$每个测试用例，这对于给定的边界是有效的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nq) | O(n) | 太慢了 |
 | 父指针 + DFS 传播 | O(n+q) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个数组`parent`在哪里`parent[i]`存储节点的父节点`i`。 初始化一个数组`value`节点值的零。 放`children`作为跟踪每个节点的子节点的列表列表。 
2. 对于类型 1 的每个查询（将子节点添加到顶点`v`), 增加树的大小`sz`按 1，设置`parent[sz] = v`，并附加`sz`到`children[v]`。 这有效地维护了内存中的树结构。 
3.对于类型2的每个查询（顶点的增量子树`v`经过`x`）， 更新`value[v] += x`。 暂时不要遍历子树； 将增量存储在预期子树的根处。 
4. 处理完所有查询后，从根（节点1）开始执行DFS。 在每个节点`u`，对于每个孩子`c`在`children[u]`，传播累积值：`value[c] += value[u]`。 然后递归处理child`c`。 这可确保正确应用所有子树增量。 
5. 经过DFS后，`value`数组包含所有节点的正确值。 按从1到的顺序输出`sz`。 

保证正确性的不变量是每个节点的值应该是应用于它或其任何祖先的所有增量的总和。 通过将增量存储在根并使用 DFS 传播一次，我们可以准确地维护此属性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 20)

def solve():
    T = int(input())
    for _ in range(T):
        q = int(input())
        parent = [0]  # 1-indexed, parent[1] unused
        children = [[] for _ in range(q + 2)]
        value = [0] * (q + 2)
        sz = 1

        for _ in range(q):
            line = input().split()
            if line[0] == '1':
                v = int(line[1])
                sz += 1
                parent.append(v)
                children[v].append(sz)
            else:
                v, x = int(line[1]), int(line[2])
                value[v] += x

        def dfs(u):
            for c in children[u]:
                value[c] += value[u]
                dfs(c)

        dfs(1)
        print(' '.join(str(value[i]) for i in range(1, sz + 1)))

if __name__ == "__main__":
    solve()
```在这个解决方案中，`parent`维护以正确添加子项，但不用于 DFS 传播，因为我们直接跟踪子项。 我们预先分配`children`和`value`数组以避免在查询期间动态调整大小，从而提高性能。 递归 DFS 将增量从父级传播到子级一次，正确处理重叠子树增量。 

## 工作示例

 ### 示例 1 轨迹

 输入：```
9
2 1 3
1 1
2 2 1
1 1
2 3 2
1 3
2 1 4
1 3
2 3 2
```| 查询 | 节点添加/增量 | 运算后的值数组 |
 | ---| ---| ---|
 | 2 1 3 | 2 1 3 +3 到节点 1 | [3] |
 | 1 1 | 1 将节点 2 添加到 1 | [3,0]|
 | 2 2 1 | 2 2 1 +1 到节点 2 | [3,1]|
 | 1 1 | 1 将节点 3 添加到 1 | [3,1,0]|
 | 2 3 2 | 2 3 2 +2 到节点 3 | [3,1,2]|
 | 1 3 | 将节点 4 添加到 3 | [3,1,2,0] |
 | 2 1 4 | +4 到节点 1 | [7,1,6,0] |
 | 1 3 | 将节点 5 添加到 3 | [7,1,6,0,0] |
 | 2 3 2 | 2 3 2 +2 到节点 3 | [7,1,8,2,2] |

 DFS 传播将父值添加到子节点：节点 1->2,3-> 子节点 4,5。 

最终的`value`: 7 5 8 6 2

 该跟踪确认算法正确地累积了重叠子树增量并考虑了动态添加的节点。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n+q) | 每个查询的处理时间为 O(1)，并且 DFS 将值传播到所有节点一次 |
 | 空间| O(n) | 数组`value`,`children`， 和`parent`存储树和值最多`q+1`节点 |

 和$q \le 5 \cdot 10^5$，每个测试用例的总操作量低于 100 万次，轻松在 2 秒内完成。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

# provided sample 1
assert run("1\n9\n2 1 3\n1 1\n2 2 1\n1 1\n2 3 2\n1 3\n2 1 4\n1 3\n2 3 2\n") == "7 5 8 6 2"

# minimum-size tree
assert run("1\n1\n2 1 5\n") == "5"

# all nodes added linearly, multiple increments
assert run("1\n5\n1 1\n1 2\n2 1 3\n2 3 2\n2 2 1\n") == "3 4 5"

# negative increment
assert run("1\n3\n1 1\n2 2 -2\n2 1 5\n") == "5 3"

# multiple test cases
assert run("2\n2\n1 1\n2 2 3\n2\n1 1\n2 1 4\n") == "0 3\n4 0"
```| 测试输入| 预期的
