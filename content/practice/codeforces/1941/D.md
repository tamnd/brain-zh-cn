---
title: "CF 1941D - 鲁道夫和球类游戏"
description: "我们有一圈由 n 个玩家组成的圆圈，顺时针编号为 1 到 n。 球从球员 x 开始。 有 m 次投掷，每次投掷都有距离 r_i 和记住的方向 c_i。 方向可以是顺时针 (0)、逆时针 (1) 或未知 (?)。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1941
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 933 (Div. 3)"
rating: 1200
weight: 1941
solve_time_s: 77
verified: false
draft: false
---
[CF 1941D - 鲁道夫和球类游戏](https://codeforces.com/problemset/problem/1941/D)

 **评分：** 1200
 **标签：** dfs 和类似的、dp、实现
 **求解时间：** 1m 17s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个圈子`n`球员，编号为 1 至`n`顺时针。 球从球员开始`x`。 有`m`投掷，每次投掷都有一个距离`r_i`和记住的方向`c_i`。 方向可以是顺时针（`0`），逆时针（`1`），或未知（`?`）。 毕竟`m`传球时，我们需要根据信息找到所有可能持球的球员。 

从概念上讲，我们可以将其建模为圆上的一组位置。 最初，该组只有起始玩家。 每次投掷要么将当前可能的位置顺时针移动`r_i`，逆时针通过`r_i`，或两者（如果方向未知）。 最后，该集合包含所有可能的结束位置。 

限制条件适中：`n`和`m`最多 1000 个，并且所有的总和`n*m`跨测试用例≤ 2×10^5。 这排除了每个测试用例比 O(n * m) 更差的任何算法。 

需要注意的边缘情况包括：`c_i`未知（`?`）对于所有投掷，这意味着可能的结束位置的数量可能会爆炸。 另一个微妙之处是围绕圆的模运算。 玩家编号以 1 为索引，因此在添加或减去距离时，我们必须正确环绕。 例如，移动`-1`来自玩家`1`落在玩家身上`n`， 不是`0`。 同样，移动`+1`从`n`重新着陆`1`。 

一种忘记模算术的幼稚实现会默默地产生无效位置，而一个处理`?`错误可能会错过有效的可能性。 

## 方法

 蛮力方法将模拟每一条可能的路径。 从初始玩家开始，每次投掷，根据方向生成所有新位置。 如果投掷未知，则将状态分为顺时针和逆时针移动。 后`m`抛出，收集所有结果位置。 这是正确的，但在最坏的情况下，`?`每次投掷都会使每一步的位置数量加倍。 即 O(2^m * m)，当`m`最多为1000。 

关键的见解是我们不需要跟踪_单独的路径_。 球的位置模数`n`仅取决于顺时针移动减去逆时针移动的总和。 如果投掷的方向未知，则允许两种可能性，但我们仍然可以通过传播一组位置来计算所有可到达的位置。 具体来说，我们可以维护一个布尔数组`reachable[1..n]`标记每次投掷后可能的位置。 对于每个已知方向，我们相应地移动当前可到达的位置。 为了`?`，我们标记顺时针和逆时针移位。 使用模块化算术和集合传播，每次抛出都需要 O(n) 时间，从而为每个测试用例提供总体 O(n*m) 时间，这符合约束条件。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^m * m) | O(2^m * m) | O(2^m) | O(2^m) | 太慢了 |
 | 最优（集合传播/DP）| O(n * m) | O(n) | 已接受 |

 ## 算法演练

 1.初始化布尔数组`reachable[1..n]`全部都是假的，除了`reachable[x] = True`， 在哪里`x`是起始玩家。 这代表当前可能持球的球员。 
2. 迭代每次抛出`(r_i, c_i)`:

 - 对于顺时针投掷（`c_i == '0'`），为每个当前可到达的玩家创建一个新的布尔数组`p`， 标记`(p + r_i - 1) % n + 1`作为可达的。 
- 对于逆时针投掷（`c_i == '1'`）， 标记`(p - r_i - 1 + n) % n + 1`作为可达的。 
- 对于未知的投掷（`c_i == '?'`），将顺时针和逆时针目的地标记为可达。 
3. 处理完所有抛出后，收集所有标记为可达的位置。 按输出的升序对它们进行排序。 
4. 输出可能的位置数和排序后的列表。 

为什么它有效：布尔数组不变量保证在任何步骤，`reachable[p]`当且仅当球可以到达球员时才为真`p`那一刻。 我们通过同时允许两个转换来处理未知方向，因此不会遗漏任何可能的结束位置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m, x = map(int, input().split())
        reachable = [False] * (n + 1)
        reachable[x] = True
        
        for _ in range(m):
            r, c = input().split()
            r = int(r)
            new_reachable = [False] * (n + 1)
            for i in range(1, n + 1):
                if not reachable[i]:
                    continue
                if c == '0' or c == '?':
                    new_pos = (i + r - 1) % n + 1
                    new_reachable[new_pos] = True
                if c == '1' or c == '?':
                    new_pos = (i - r - 1 + n) % n + 1
                    new_reachable[new_pos] = True
            reachable = new_reachable
        
        result = [i for i in range(1, n + 1) if reachable[i]]
        print(len(result))
        print(' '.join(map(str, result)))

if __name__ == "__main__":
    solve()
```实施说明：我们使用`(i + r - 1) % n + 1`对于顺时针移动和`(i - r - 1 + n) % n + 1`逆时针处理基于 1 的索引和模块化包装。 分开的`new_reachable`array 避免在同一步骤中覆盖位置，这一点至关重要。 

## 工作示例

 **示例输入 1：**```
6 3 2
2 ?
2 ?
2 ?
```| 步骤| 当前可达| 扔| 新可达|
 | --- | --- | --- | --- |
 | 0 | {2} | 2 ? | {4, 6} |
 | 1 | {4, 6} | 2 ? | {2, 6, 4} → {2, 4, 6} |
 | 2 | {2,4,6}| 2 ? | {2,4,6}|

 所有可到达的玩家都收敛到 {2, 4, 6}，这与预期输出相匹配。 

**示例输入 2：**```
12 1 2
3 1
```| 步骤| 当前可达| 扔| 新可达|
 | --- | --- | --- | --- |
 | 0 | {2} | 3 1 | 3 1 {(2-3-1+12)%12+1 = 11} |
 | 最终可达 = {11}。 | | | |

 这些表确认该算法正确处理未知方向和模运算。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n*m) | 每次抛出都会更新布尔数组中的 n 个位置。 |
 | 空间| O(n) | 布尔数组存储可到达的玩家。 |

 给定 n、m ≤ 1000 且 n*m ≤ 2×10^5，其运行时间不超过 2 秒。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# Provided samples
assert run("5\n6 3 2\n2 ?\n2 ?\n2 ?\n12 1 2\n3 1\n10 7 4\n2 ?\n9 1\n4 ?\n7 0\n2 0\n8 1\n5 ?\n5 3 1\n4 0\n4 ?\n1 ?\n4 1\n1 2 ?") == \
"3\n2 4 6\n1\n11\n4\n3 5 7 9\n3\n2 3 5\n1\n3", "sample 1"

# Custom: minimum input
assert run("1\n2 1 1\n1 ?") == "2\n1 2", "min size, unknown direction"

# Custom: all clockwise
assert run("1\n5 3 3\n2 0\n1 0\n2 0") == "1\n3", "clockwise wrapping"

# Custom: all counterclockwise
assert run("1\n5 3 3\n2 1\n1 1\n2 1") == "1\n3", "counterclockwise wrapping"

# Custom: mix known and unknown
assert run("1\n4 2 1\n1 ?\n2 0") == "3\n1 2 4", "mix of ? and 0"

# Custom: max distance
assert run("1\n5 1 3\n
```
