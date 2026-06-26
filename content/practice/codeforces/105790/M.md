---
title: "CF 105790M - 巨型蠕虫"
description: "多元宇宙形成一棵有根有向树，根宇宙为 1。每条边都从恒星较多的宇宙指向恒星较少的宇宙。"
date: "2026-06-26T03:51:30+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105790
codeforces_index: "M"
codeforces_contest_name: "UDESC Selection Contest 2024-1"
rating: 0
weight: 105790
solve_time_s: 51
verified: true
draft: false
---

[CF 105790M - 巨型蠕虫](https://codeforces.com/problemset/problem/105790/M)

 **评级：** -
 **标签：** -
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 多元宇宙形成一棵以根宇宙为根的有向树`1`。 每条边都从恒星较多的宇宙指向恒星较少的宇宙。 由于恒星数量沿着每条从根到叶的路径严格减少，因此在可以到达一组给定节点的所有宇宙中，恒星数量最少的宇宙就是这些节点的最深的共同祖先。 在树的术语中，这是它们的最低共同祖先（LCA）。 

对于每个查询，我们都会得到一个不同宇宙的有序列表$$a_1,a_2,\dots,a_K$$我们必须计算$$\sum_{1 \le i \le j \le K} f(i,j)$$在哪里$f(i,j)$是可以到达连续段中每个宇宙的最深节点的宇宙标识符$a_i,\dots,a_j$。 由于该节点正是该段中所有节点的 LCA，因此任务变为：$$\sum_{1 \le i \le j \le K}
\text{LCA}(a_i,a_{i+1},\dots,a_j)$$使用宇宙数本身作为添加的值。 

该树最多包含$10^5$节点，最多有$10^5$查询，所有查询长度之和最多为$3 \cdot 10^5$。 独立检查每个子数组的解决方案需要$O(K^2)$每个查询的工作量，这远远超出了限制范围。 

一个微妙的观察是节点标签不是深度或星数。 答案会添加 LCA 操作返回的 Universe 标识符。 

考虑以下查询：```
2 4 5
```在示例树中，4 和 5 都是 3 的子级。 

间隔为：```
[4] -> 4
[5] -> 5
[4,5] -> 3
```答案是：```
4 + 5 + 3 = 12
```如果不小心实现对 LCA 进行计数而不是对它们的标识符进行求和，将会产生错误的结果。 

另一个边缘情况是长度为一的查询：```
1 7
```唯一的间隔是`[7]`，单个节点的LCA就是节点本身。 答案一定是`7`，而不是其父级或根。 

## 方法

 蛮力的想法很简单。 对于每个间隔$[i,j]$，计算其中所有节点的 LCA 并将结果添加到答案中。 

一种方法是延长每个起始位置的间隔。 如果我们在移动右端点的同时保持当前的 LCA，那么每个区间都可以在$O(\log N)$使用二元提升。 总复杂度变为$O(K^2 \log N)$。 和$K$一样大$10^5$，这是完全不可行的。 

关键的观察结果是 LCA 崩溃得非常快。 

固定位置$r$。 查看所有以以下结尾的子数组$r$：```
[a_r]
[a_{r-1}, a_r]
[a_{r-2}, a_r]
...
```当我们向左延伸区间时，LCA 只能在树中向上移动。 一旦 LCA 发生变化，它就会成为前一个 LCA 的严格祖先。 

沿着任何从根到叶的路径，只有$O(\log N)$重复 LCA 合并后可能出现的不同祖先。 这与经典的“子数组的不同 gcd”问题中使用的属性相同。 以固定位置结束的子阵列的不同 LCA 集仍然很小。 

假设我们已经知道以位置结束的子数组的所有不同 LCA$r-1$。 对于新节点$a_r$，每个旧的 LCA 值$v$变成：$$\text{LCA}(v,a_r)$$为扩展子数组。 我们还添加了新的单元素子数组，其 LCA 为$a_r$。 

许多结果值是相等的，因此我们合并相等的 LCA 并仅保留它们的计数。 不同 LCA 的数量仍然很少，从而提供了有效的解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(K^2 \log N)$|$O(1)$| 太慢了 |
 | 最佳|$O(K \log^2 N)$每个查询|$O(\log N)$每个查询| 已接受 |

 所有查询的总复杂度为$O((\sum K)\log^2 N)$，这很容易拟合，因为$\sum K \le 3 \cdot 10^5$。 

## 算法演练

 ### 预处理

 1. 在节点处建立树的根`1`。 
2. 运行 DFS 来计算深度和二进制提升表`up[v][j]`， 在哪里`up[v][j]`是$2^j$的第一个祖先`v`。 
3. 实施`lca(u,v)`使用二进制提升的函数。 

### 处理一个查询

 1. 维护清单`cur`包含对`(lca_value, count)`。 

含义是：在以前一个位置结束的所有子数组中，恰好`count`其中的 LCA 等于`lca_value`。 
2.对于下一个节点`x`, 开始一个新列表`nxt`。 
3. 插入`(x,1)`进入`nxt`。 

这表示单元素子数组`[x]`。 
4. 对于每对`(v,c)`在`cur`, 计算`w = lca(v,x)`。 

每个子数组表示为`(v,c)`成为一个更长的子数组，结束于`x`，其新的 LCA 为`w`。 
5. 如果最后一对已存储在`nxt`有生命周期评估`w`， 添加`c`到其计数。 否则追加`(w,c)`。 

连续的相等 LCA 被合并，以便仅保留不同的值。 
6. 更换`cur`和`nxt`。 
7. 添加$$\sum (\text{lca\_value} \times \text{count})$$在所有对中`cur`到查询答案。 
8. 对查询序列的每个节点重复此操作。 

### 为什么它有效

 加工后位置`r`, 列表`cur`表示所有结束于的子数组`r`，按 LCA 分组。 每个子数组结束于`r`是单元素区间`[a_r]`或结束于的子数组的扩展`r-1`。 

对于延长的时间间隔，新的 LCA 恰好是$$\text{LCA}(\text{old LCA}, a_r)$$因为一组节点的LCA可以通过重复的成对LCA操作来增量累积。 

因此每个子数组结束于`r`恰好为一组中的一个做出贡献`cur`，每组对应实际的子数组。 求和`lca_value × count`给出结束于的所有间隔的总贡献`r`。 对所有位置求和只会对每个间隔计数一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n, q = map(int, input().split())

    g = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = map(int, input().split())
        g[u].append(v)
        g[v].append(u)

    LOG = (n + 1).bit_length()

    depth = [0] * (n + 1)
    up = [[0] * (n + 1) for _ in range(LOG)]

    stack = [1]
    parent = [0] * (n + 1)
    parent[1] = 1

    order = [1]
    while stack:
        v = stack.pop()
        for to in g[v]:
            if to == parent[v]:
                continue
            parent[to] = v
            depth[to] = depth[v] + 1
            stack.append(to)
            order.append(to)

    for v in range(1, n + 1):
        up[0][v] = parent[v]

    for j in range(1, LOG):
        prev = up[j - 1]
        cur = up[j]
        for v in range(1, n + 1):
            cur[v] = prev[prev[v]]

    def lca(a, b):
        if depth[a] < depth[b]:
            a, b = b, a

        diff = depth[a] - depth[b]
        bit = 0
        while diff:
            if diff & 1:
                a = up[bit][a]
            diff >>= 1
            bit += 1

        if a == b:
            return a

        for j in range(LOG - 1, -1, -1):
            if up[j][a] != up[j][b]:
                a = up[j][a]
                b = up[j][b]

        return up[0][a]

    answers = []

    for _ in range(q):
        arr = list(map(int, input().split()))
        k = arr[0]
        nodes = arr[1:]

        cur = []
        ans = 0

        for x in nodes:
            nxt = [(x, 1)]

            for v, cnt in cur:
                w = lca(v, x)

                if nxt[-1][0] == w:
                    nxt[-1] = (w, nxt[-1][1] + cnt)
                else:
                    nxt.append((w, cnt))

            cur = nxt

            for v, cnt in cur:
                ans += v * cnt

        answers.append(str(ans))

    sys.stdout.write("\n".join(answers))

if __name__ == "__main__":
    main()
```预处理为整棵树构建一次二元提升表。 然后每个 LCA 查询都运行在$O(\log N)$。 

查询处理仅保留以当前位置结束的子数组的不同 LCA。 当通过新节点扩展所有先前的子数组时，多个 LCA 通常会折叠成同一个祖先。 合并相邻的相等结果至关重要，否则列表可能会增长到线性大小。 

答案使用 LCA 操作返回的 Universe 标识符。 既然可以有$O(K^2)$间隔，最终的总和应存储在 64 位整数中。 Python 整数会自动处理这个问题。 

## 工作示例

 ### 示例 1

 树：```
1
├─2
└─3
  ├─4
  └─5
```询问：```
2 4 5
```| 职位| 节点| 处理后的电流| 贡献|
 | ---| ---| ---| ---|
 | 1 | 4 | (4,1) | 4 |
 | 2 | 5 | (5,1), (3,1) | (5,1), (3,1) | 8 |

 全部的：```
4 + 8 = 12
```位置2处的两组对应区间`[5]`和`[4,5]`。 

### 示例 2

 星形树：```
1
├─2
├─3
└─4
```询问：```
3 2 3 4
```| 职位| 节点| 处理后的电流| 贡献|
 | ---| ---| ---| ---|
 | 1 | 2 | (2,1) | 2 |
 | 2 | 3 | (3,1), (1,1) | (3,1), (1,1) | 4 |
 | 3 | 4 | (4,1), (1,2) | (4,1), (1,2) | 6 |

 回答：```
2 + 4 + 6 = 12
```此示例显示了多个间隔如何共享相同的 LCA 并由单个间隔表示`(value,count)`一对。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(N \log N + (\sum K)\log^2 N)$| 预处理加查询处理|
 | 空间|$O(N \log N)$| 二元升降台|

 预处理费用一次性支付。 由于总查询长度最多为$3 \cdot 10^5$，整体运行时间完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    import sys as _sys
    old_stdout = _sys.stdout
    _sys.stdout = out

    try:
        main()
    finally:
        _sys.stdout = old_stdout

    return out.getvalue().strip()

# sample 1
assert run(
"""5 2
1 2
1 3
3 4
3 5
1 2
2 4 5
"""
) == "2\n12"

# sample 2
assert run(
"""4 1
1 2
1 3
1 4
3 2 3 4
"""
) == "12"

# sample 3
assert run(
"""1 1
1 1
"""
) == "1"

# single node query
assert run(
"""2 1
1 2
1 2
"""
) == "2"

# chain
assert run(
"""4 1
1 2
2 3
3 4
3 2 3 4
"""
) == "16"

# all LCAs become root
assert run(
"""5 1
1 2
1 3
1 4
1 5
4 2 3 4 5
"""
) == "20"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单节点树 | 1 | 最小尺寸|
 | 长度为1的查询 | 节点 ID | 一个节点的LCA等于其自身 |
 | 链树| 16 | 16 祖先-后代 LCA |
 | 星树| 20 | 许多音程共享根 |
 | 样品1 | 2, 12 | 一般正确性 |

 ## 边缘情况

 仅包含一个 Universe 的查询：```
2 1
1 2
1 2
```唯一的间隔是`[2]`。 该算法创建`cur = [(2,1)]`，添加`2 * 1`，并返回`2`。 不需要与另一个节点进行 LCA 计算。 

一条链：```
1 - 2 - 3 - 4
query: 2 3 4
```区间 LCA 为：```
[2] = 2
[3] = 3
[4] = 4
[2,3] = 2
[3,4] = 3
[2,3,4] = 2
```答案是：```
2 + 3 + 4 + 2 + 3 + 2 = 16
```分组 LCA 表示自然地处理了这个问题，因为 LCA 仅在必要时向上移动。 

一颗星扎根于`1`：```
1 connected to 2,3,4,5
query: 2 3 4 5
```每个长度至少为 2 的区间都有 LCA`1`。 在处理过程中，许多扩展折叠成相同的值，并且合并步骤将它们组合成一个`(1,count)`一对。 这正是保持存储状态数量较少的情况。
