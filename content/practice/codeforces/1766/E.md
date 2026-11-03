---
title: "CF 1766E - 分解"
description: "对于任何数组段，我们从左到右处理其元素并维护一个子序列列表。 当新值到达时，我们查找当前最后一个元素与新值具有正位与的第一个子序列。"
date: "2026-06-09T13:00:26+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "data-structures", "divide-and-conquer", "dp", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1766
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 139 (Rated for Div. 2)"
rating: 2300
weight: 1766
solve_time_s: 163
verified: false
draft: false
---

[CF 1766E - 分解](https://codeforces.com/problemset/problem/1766/E)

 **评分：** 2300
 **标签：** 二分查找、暴力破解、数据结构、分而治之、dp、两个指针
 **求解时间：** 2m 43s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 对于任何数组段，我们从左到右处理其元素并维护一个子序列列表。 

当新值到达时，我们查找当前最后一个元素与新值具有正位与的第一个子序列。 如果存在这样的子序列，我们将值附加到那里并更新该子序列的最后一个元素。 否则我们创建一个全新的子序列。 

让$f(segment)$是此过程创建的子序列的最终数量。 

任务是求和$f$给定数组的每个子数组。 

数组长度达到$3 \cdot 10^5$，所以大约有$4.5 \cdot 10^{10}$子数组。 任何单独评估子数组的算法都是没有希望的。 甚至一个$O(n^2)$解决方案完全超出范围。 我们需要接近线性时间的东西。 

不寻常的约束是每个数组值都属于$\{0,1,2,3\}$。 整个解决方案来自于利用这个值集的微小程度。 

第一个微妙的情况是值$0$。 零永远不能追加到现有子序列中，因为$x \& 0 = 0$对于每一个$x$。 每个零总是创建一个新的子序列。 

例如：```
[0, 0]
```分解创建两个子序列，因此$f=2$。 

另一个微妙的情况是，算法总是选择第一个兼容的子序列，而不是任意的子序列。 

例如：```
[1, 2, 3]
```加工后$1,2$，活动子序列是：```
[1]
[2]
```什么时候$3$到达时，它被附加到第一个子序列，因为$1 \& 3 > 0$。 选择第二个会产生不同的状态和错误的答案。 

第三个陷阱是只有每个子序列当前的最后一个元素才重要。 早期的因素永远不会影响未来的决策。 

例如：```
[1,3,2]
```第一个子序列变为$[1,3,2]$。 未来的决策仅取决于最终值$2$，而不是较早的$1,3$。 

## 方法

 蛮力的想法很简单。 

选择起始位置$l$。 延伸右端点$r$一次一步。 维持分解$a[l..r]$并跟踪当前存在多少个子序列。 

这是正确的，因为它直接模拟了定义。 

问题在于复杂性。 有$O(n^2)$子数组。 即使每个扩展都是$O(1)$，总工作量仍然是二次方，对于$n=3\cdot10^5$。 

关键的观察结果是值仅限于$\{0,1,2,3\}$。 

考虑某个时刻的分解状态。 未来的决策仅取决于每个当前“可用”子序列的最后一个元素。 

结尾为的子序列$0$很特别。 他们永远不能接受任何未来的价值，因为$0 \& x = 0$为所有人$x$。 一旦子序列结束于$0$，它对于未来的转换变得无关紧要。 

所以我们只需要记住非零子序列的最后一个值。 

这些值属于$\{1,2,3\}$。 如果我们重复应用第一兼容子序列规则，则只能出现极少数状态。 事实上，可到达的状态只有 16 个。 这是关键的压缩。 最初的过程看起来很复杂，但它整个未来的行为是由仅有的 16 种可能状态之一决定的。 这个想法正是官方解决方案的基础。 

一旦状态空间恒定，我们就可以对位置和状态进行动态规划。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2)$或者更糟|$O(n)$| 太慢了|
 | 最佳 |$O(n \cdot S)$,$S=16$|$O(S)$| 已接受 |

 ## 算法演练

 令状态为所有非零子序列的最后值的有序列表。 

示例：```
()
(1)
(2,1)
(3,2,1)
```只有 16 个可到达的状态。 

定义一个转换函数：```
go(state, x)
```它处理一个新值。 

如果$x=0$，总是会创建一个新的子序列，但状态不会改变，因为零结尾的子序列以后永远不会有用。 

如果$x>0$，从左到右扫描状态。 

如果第一个值具有正 AND 与$x$找到后，将该值替换为$x$。 

否则追加$x$到状态结束。 

转换还返回：```
add = 1
```如果创建了新的子序列，否则```
add = 0
```现在定义：```
dp[i][state]
```作为头寸产生的总贡献$i,i+1,\dots,n-1$，假设当前分解状态等于`state`。 

假设位置$i$创造`add`新的子序列。 

每个新创建的子序列都会增加$f$对于每个以 结尾的子数组加 1$i,i+1,\dots,n-1$。 

确切地说有：```
n - i
```这样的结局。 

那么职位的贡献$i$等于：```
add * (n - i)
```加工后$a_i$，我们进入下一个状态。 

这给出了递归式：```
dp[i][state]
=
add * (n - i)
+
dp[i+1][next_state]
```答案是：```
sum(dp[i][empty_state])
for all starting positions i
```这与官方解决方案中使用的递归相同。 

### 为什么它有效

 对于固定的起始位置$l$，每次分解都会在位置创建一个新的子序列$r$，值$f(a[l..t])$每增加 1$t \ge r$。 

正好有$n-r$这样的结局。 

循环在创建时就计算此增加，并立即将其计入所有未来的结局。 由于每次增加$f$只计算一次，并且每个贡献都持续正确的结束数量，所得总和等于所有子数组的总和。 

该状态精确地包含未来转换所需的信息：所有非零子序列的当前最后值。 任何早期信息都不会影响未来的选择。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))

states = [()]
state_id = {(): 0}

def transition(state, x):
    arr = list(state)

    if x == 0:
        return 1, state

    for i, v in enumerate(arr):
        if v & x:
            arr[i] = x
            return 0, tuple(arr)

    arr.append(x)
    return 1, tuple(arr)

# Enumerate all reachable states.
ptr = 0
while ptr < len(states):
    s = states[ptr]
    ptr += 1

    for x in range(4):
        _, ns = transition(s, x)
        if ns not in state_id:
            state_id[ns] = len(states)
            states.append(ns)

m = len(states)

nxt_state = [[0] * 4 for _ in range(m)]
add_cost = [[0] * 4 for _ in range(m)]

for sid, s in enumerate(states):
    for x in range(4):
        add, ns = transition(s, x)
        nxt_state[sid][x] = state_id[ns]
        add_cost[sid][x] = add

dp_next = [0] * m
answer = 0
empty_id = state_id[()]

for pos in range(n - 1, -1, -1):
    dp_cur = [0] * m
    x = a[pos]

    for sid in range(m):
        ns = nxt_state[sid][x]
        add = add_cost[sid][x]

        dp_cur[sid] = add * (n - pos) + dp_next[ns]

    answer += dp_cur[empty_id]
    dp_next = dp_cur

print(answer)
```第一部分构建完整的可达状态图。 从空状态开始，我们重复应用所有四个可能的值。 仅出现 16 个州。 

转换表存储两条信息。 第一个是下一个状态。 第二个是是否创建了新的子序列。 

动态规划从右向左运行。`dp_next`代表位置`i+1`， 和`dp_cur`代表位置`i`。 

表达式```
add * (n - pos)
```是中心计数步骤。 创建的新子序列`pos`贡献于结束于或之后的每个子数组`pos`。 

所有算术都适合 64 位整数。 在 Python 中，整数无论如何都是无界的。 

## 工作示例

 ### 示例 1

 输入：```
3
1 2 3
```状态被写为非零子序列尾部的列表。 

| 职位| 价值| 之前的状态 | 新的子序列？ | 之后的状态 |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | ()| 是的 | (1) |
 | 1 | 2 | (1) | 是的 | (1,2) |
 | 2 | 3 | (1,2) | 没有 | (3,2) |

 子数组：

 | 子数组| f |
 | --- | --- |
 | [1] | 1 |
 | [1,2]| 2 |
 | [1,2,3]| 2 |
 | [2] | 1 |
 | [2,3]| 1 |
 | [3] | 1 |

 全部的：```
1 + 2 + 2 + 1 + 1 + 1 = 8
```此示例表明，即使存在多个子序列，值也可以重用现有子序列。 必须选择第一个兼容的。 

### 示例 2

 输入：```
3
0 0 0
```| 职位| 价值| 之前的状态 | 新的子序列？ | 之后的状态 |
 | --- | --- | --- | --- | --- |
 | 0 | 0 | ()| 是的 | ()|
 | 1 | 0 | ()| 是的 | ()|
 | 2 | 0 | ()| 是的 | ()|

 子数组：

 | 子数组| f |
 | --- | --- |
 | [0]| 1 |
 | [0,0]| 2 |
 | [0,0,0]| 3 |
 | [0]| 1 |
 | [0,0]| 2 |
 | [0]| 1 |

 全部的：```
10
```这说明了为什么不需要将零结束子序列存储在状态中。 它们永远不会影响未来的转换。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \cdot S)$|$S=16$可达状态|
 | 空间|$O(S)$| 两个 DP 层加上转换表 |

 自从$S$是一个很小的常数，运行时间实际上是线性的$n$。 为了$n=3 \cdot 10^5$，该解决方案很容易满足时间和内存的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n = int(input())
    a = list(map(int, input().split()))

    states = [()]
    state_id = {(): 0}

    def transition(state, x):
        arr = list(state)

        if x == 0:
            return 1, state

        for i, v in enumerate(arr):
            if v & x:
                arr[i] = x
                return 0, tuple(arr)

        arr.append(x)
        return 1, tuple(arr)

    ptr = 0
    while ptr < len(states):
        s = states[ptr]
        ptr += 1

        for x in range(4):
            _, ns = transition(s, x)
            if ns not in state_id:
                state_id[ns] = len(states)
                states.append(ns)

    m = len(states)

    nxt = [[0] * 4 for _ in range(m)]
    add = [[0] * 4 for _ in range(m)]

    for sid, s in enumerate(states):
        for x in range(4):
            c, ns = transition(s, x)
            nxt[sid][x] = state_id[ns]
            add[sid][x] = c

    dp_next = [0] * m
    ans = 0
    empty = state_id[()]

    for pos in range(n - 1, -1, -1):
        dp_cur = [0] * m

        for sid in range(m):
            ns = nxt[sid][a[pos]]
            dp_cur[sid] = add[sid][a[pos]] * (n - pos) + dp_next[ns]

        ans += dp_cur[empty]
        dp_next = dp_cur

    return str(ans)

# provided sample
assert run("8\n1 3 2 0 1 3 2 1\n") == "71"

# minimum size
assert run("1\n0\n") == "1"

# single nonzero
assert run("1\n3\n") == "1"

# all zeros
assert run("3\n0 0 0\n") == "10"

# first-fit behavior
assert run("3\n1 2 3\n") == "8"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 0`|`1`| 最小尺寸|
 |`1 / 3`|`1`| 单个非零值 |
 |`3 / 0 0 0`|`10`| 每个零都会创建一个新的子序列 |
 |`3 / 1 2 3`|`8`| 正确的第一兼容子序列行为 |

 ## 边缘情况

 考虑：```
1
0
```分解立即创建一个子序列。 由于不存储零结尾子序列，因此状态保持为空。 民主党补充道$1 \cdot 1$，得出正确答案 1。 

考虑：```
2
0 0
```第一个零创建一个子序列。 第二个零创建另一个零。 子数组具有值：```
[0] -> 1
[0,0] -> 2
[0] -> 1
```总数为 4。该算法处理此问题是因为每个零转换都有贡献`add = 1`，而状态永远不会改变。 

考虑：```
3
1 2 3
```粗心的实现可能会附加`3`到第二个子序列而不是第一个兼容的子序列。 实际规则选择第一个兼容子序列，产生状态`(3,2)`而不是`(1,3)`。 转换函数显式地从左到右扫描并在第一个匹配处停止，从而准确地保留定义。 

考虑：```
4
1 1 1 1
```只有第一个元素才会创建新的子序列。 后面的每个元素都重用相同的子序列。 DP 正确记录了一个创造事件并将其贡献传播到所有较长的结局。 这验证了在不创建额外状态的情况下处理重复重用。
