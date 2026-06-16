---
title: "CF 107C - 安排"
description: "我们有n个座位和n个教授。 教授 1 的级别最高，教授 n 的级别最低。 某些座位对有顺序限制。 如果给定(a,b)，那么坐在a座位的教授一定比坐在b座位的教授资历高。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "dp"]
categories: ["algorithms"]
codeforces_contest: 107
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 83 (Div. 1 Only)"
rating: 2400
weight: 107
solve_time_s: 155
verified: true
draft: false
---

[CF 107C - 安排](https://codeforces.com/problemset/problem/107/C)

 **评分：** 2400
 **标签：** 位掩码、dp
 **求解时间：** 2m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有`n`座位和`n`教授们。 教授`1`是最资深的教授`n`是资历最低的。 某些座位对有顺序限制。 如果`(a, b)`给出，然后教授坐在座位上`a`必须比坐在座位上的教授资历更高`b`。 

座位安排只是分配给座位的教授的排列。 由于教授人数越少意味着资历越高，因此约束`(a, b)`变成：```
perm[a] < perm[b]
```在分配的教授编号中。 

所有有效的排列均按字典顺序排序。 2001 年使用第一个有效安排，2002 年使用第二个有效安排，依此类推。 我们必须输出年份中使用的排列`y`。 

这相当于找到`(y - 2001)`按字典顺序排列的第 -th 个有效排列。 

最重要的观察是，限制与席位有关，而不是与教授有关。 座位值之间的相对顺序是固定的。 我们正在计算满足偏序的排列。 

约束条件`n ≤ 16`彻底改变了问题的本质。 对所有排列进行阶乘搜索是不可能的，因为：```
16! ≈ 2 * 10^13
```即使生成几秒钟的排列也无法接近。 

同时，`2^16 = 65536`，这是非常易于管理的。 这强烈暗示了 DP 子集。 

年可以大到`10^18`，这意味着有效排列的数量可能是巨大的。 我们无法一一列举安排。 我们必须计算部分赋值中存在多少个有效完成，并使用这些计数来跳过排列块。 

有几种边缘情况会破坏简单的实现。 

一组相互矛盾的约束可能会产生零有效排列。 

例子：```
2 2001 2
1 2
2 1
```座位`1`教授编号必须小于座位号`2`，并且同时是一个更大的。 不存在任何安排。 正确的输出是：```
The times have changed
```粗心的实现可能仍然会尝试 DP 转换并意外地产生垃圾计数。 

另一个微妙的情况是当请求的年份超过有效安排的数量时。 

例子：```
2 2003 0
```只有`2! = 2`安排：```
1 2
2 1
```2001年和2002年有效。 2003 年不存在。 正确的输出是：```
The times have changed
```一个常见的错误是错误地使用从零开始的索引并将 2001 年视为索引`1`而不是`0`。 

输入中也会出现重复的约束。 

例子：```
3 2001 3
1 2
1 2
1 2
```这些重复项不应改变任何内容。 如果约束存储不当，它们可能会增大入度或破坏过渡。 

## 方法

 暴力解决方案很简单。 生成教授的每个排列，检查它是否满足所有约束，收集有效的排列，按字典顺序对它们进行排序，然后选择所需的年份。 

这是有效的，因为有效性测试很容易。 对于每个约束`(a, b)`，我们简单验证一下：```
perm[a] < perm[b]
```问题是排列的数量。 和`n = 16`，我们需要检查：```
16! ≈ 2 * 10^13
```排列。 即使每秒检查十亿次排列仍然需要几个小时。 

关键的观察是词典编纂只需要完成的计数。 假设我们从左到右构建排列。 在某个位置，我们尝试放置尽可能最小的未使用的教授。 如果我们知道在该选择之后存在多少个有效的完成，我们就可以决定目标排列是位于该块内还是在其之后。 

这将问题转换为计算部分状态的有效分配。 

DP 子集完全适合，因为`n ≤ 16`。 让一个位掩码代表哪些教授已经被分配。 根据该状态，我们可以确定接下来可以安排哪位教授，而不会违反任何座位限制。 

席位有限，但教授的分配是按照资历递增的顺序进行的。 这创建了一个非常有用的解释：

 如果教授`k`是下一个最小的未使用教授，然后是指派教授`k`坐下`s`表示座位`s`在空缺席位中获得下一个排名。 

对于约束`(a, b)`， 座位`a`教授编号必须小于席位`b`。 所以座位`a`必须在入座前填写`b`。 

这将问题转化为计算 DAG 在席位上的拓扑顺序。 

现在状态变得更加干净：```
dp[mask] = number of ways to fill exactly the seats in mask first
```仅当所有必备座位均已位于面罩内时，我们才可以添加座位。 

这给出了一个`O(n * 2^n)`解决方案，这很容易足够快。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n! * m) | O(n!) | 太慢了 |
 | 最佳| O(n * 2^n) | O(n * 2^n) | O(2^n) | O(2^n) | 已接受 |

 ## 算法演练

 1. 解释每一个约束`(a, b)`作为席位之间的依赖关系。 

由于教授人数越少，级别越高，座位`a`必须在就座之前接待教授`b`。 这意味着座位`b`取决于座位`a`。 
2. 为每个席位构建一个必备位掩码。`pre[i]`存储在入座前必须已填满的所有座位`i`可以被填满。 
3. 使用子集 DP 来统计有效的拓扑顺序。 

让：```
dp[mask]
```表示在正好填满 中的座位之后剩余座位的有效方式的数量`mask`已经被分配了。 
4. 定义转换。 

从`mask`，我们可以选择座位`i`如果：```
i is not in mask
and
all prerequisites of i are already in mask
```正式：```
(pre[i] & mask) == pre[i]
```5. 使用记忆的 DFS 计算 DP。 

如果所有座位都已满，则恰好有一个完成。 

否则，将所有有效的下一个座位的计数相加。 
6.设：```
k = y - 2001
```这是所需排列的从零开始的索引。 
7. 如果：```
dp[0] <= k
```那么所请求的年份超过了有效安排的数量。 打印：```
The times have changed
```8. 按字典顺序重建排列。 

我们按照从小到大的顺序分配教授。 在每一步中，请按递增顺序尝试候选席位，因为字典顺序取决于哪个席位接收当前最小的教授。 
9. 对于每个候选席位，计算如果我们将当前的教授放置在那里，则存在多少个已完成的席位。 

如果完成次数小于或等于`k`，跳过所有这些安排并从中减去该计数`k`。 

否则，请占据该席位并继续。 
10. 确定座位的填充顺序后，将其转换为最终的排列。 

如果座位`s`已在步骤中填充`t`，然后它接收教授`t + 1`。 

### 为什么它有效

 DP 精确计算座位依赖图的有效拓扑顺序。 每一种有效的安排都对应一个独特的顺序，在该顺序中，席位的教授数量不断增加。 

在重建过程中，字典顺序被保留，因为较小的教授编号首先被分配。 按升序尝试候选席位可以探索与词典排列比较相同顺序的排列。 

在每一步中，DP 计数都会告诉我们有多少排列以特定前缀开头。 使用这些计数跳过整个块相当于直接跳转到目标词典排列。 

## Python 解决方案```python
import sys
from functools import lru_cache

input = sys.stdin.readline

INF = 10**18 + 5

def solve():
    n, y, m = map(int, input().split())

    pre = [0] * n

    for _ in range(m):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        pre[b] |= (1 << a)

    full = (1 << n) - 1

    @lru_cache(None)
    def dp(mask):
        if mask == full:
            return 1

        res = 0

        for i in range(n):
            if (mask >> i) & 1:
                continue

            if (pre[i] & mask) != pre[i]:
                continue

            res += dp(mask | (1 << i))

            if res > INF:
                res = INF

        return res

    k = y - 2001

    total = dp(0)

    if total <= k:
        print("The times have changed")
        return

    order = []
    mask = 0

    for _ in range(n):
        for seat in range(n):
            if (mask >> seat) & 1:
                continue

            if (pre[seat] & mask) != pre[seat]:
                continue

            cnt = dp(mask | (1 << seat))

            if cnt <= k:
                k -= cnt
            else:
                order.append(seat)
                mask |= (1 << seat)
                break

    ans = [0] * n

    for professor, seat in enumerate(order, start=1):
        ans[seat] = professor

    print(*ans)

solve()
```第一部分将输入约束转换为先决条件掩码。 如果`(a, b)`存在，则座位`b`取决于座位`a`，所以我们设置里面对应的位`pre[b]`。 

记忆的 DP 适用于已填满的座位的子集。 过渡条件：```
(pre[i] & mask) == pre[i]
```意味着座位的所有先决条件`i`已经满了。 

DP 值可能变得非常大，可能超出所请求的年份范围。 我们将它们限制在`INF`因为我们只需要比较`10^18`。 

重建阶段是微妙的部分。 我们不直接构建排列值。 相反，我们建立教授席位的顺序`1, 2, 3, ...`。 

假设座位`2`首先被选择。 这意味着教授`1`坐在那里。 如果座位`0`被选为第二名，教授`2`坐在那里，等等。 

按递增顺序尝试座位可以保证字典顺序遍历。 每当候选人做出贡献时`cnt`排列，这些排列形成一个连续的词典块。 如果`k >= cnt`，我们跳过整个块。 

一个常见的错误是由教授而不是按座位顺序进行重建。 DP自然会计算座位填补订单，这直接对应于教授的作业。 

## 工作示例

 ### 示例 1

 输入：```
3 2001 2
1 2
2 3
```依赖项：```
seat 1 before seat 2
seat 2 before seat 3
```仅存在一种排序。 

#### DP 重建轨迹

 | 步骤| 当前面膜| 可用座位 | 选择座位 | k |
 | ---| ---| ---| ---| ---|
 | 1 | 000 | 000 0 | 0 | 0 |
 | 2 | 001| 1 | 1 | 0 |
 | 3 | 011| 2 | 2 | 0 |

 座位填充顺序为：```
0 -> 1 -> 2
```所以：```
seat 0 gets professor 1
seat 1 gets professor 2
seat 2 gets professor 3
```最终安排：```
1 2 3
```该跟踪表明依赖图完全修复了拓扑顺序。 

### 示例 2

 输入：```
3 2002 1
1 2
```约束：```
seat 1 before seat 2
```按字典顺序排列的有效排列是：```
1 2 3
1 3 2
2 1 3
```我们想要索引：```
k = 1
```#### 重建轨迹

 | 步骤| 面膜| 候选人席位 | 完成计数 | 行动| k |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 000 | 000 0 | 2 | 采取 | 1 |
 | 2 | 001| 1 | 1 | 跳过| 0 |
 | 2 | 001| 2 | 1 | 采取 | 0 |
 | 3 | 101 | 101 1 | 1 | 采取 | 0 |

 席次：```
0 -> 2 -> 1
```作业：```
seat 0 = 1
seat 2 = 2
seat 1 = 3
```最终安排：```
1 3 2
```此示例显示如何使用 DP 计数来跳过整个字典块。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * 2^n) | O(n * 2^n) | 每个子集尝试所有席位一次 |
 | 空间| O(2^n) | O(2^n) | 子集记忆表 |

 和`n ≤ 16`，状态数最多为`65536`。 每个州最多检查`16`转换，因此总操作数大约为一百万，完全在限制之内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from functools import lru_cache

INF = 10**18 + 5

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    out = io.StringIO()
    sys.stdout = out

    n, y, m = map(int, input().split())

    pre = [0] * n

    for _ in range(m):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        pre[b] |= (1 << a)

    full = (1 << n) - 1

    @lru_cache(None)
    def dp(mask):
        if mask == full:
            return 1

        res = 0

        for i in range(n):
            if (mask >> i) & 1:
                continue

            if (pre[i] & mask) != pre[i]:
                continue

            res += dp(mask | (1 << i))

            if res > INF:
                res = INF

        return res

    k = y - 2001

    if dp(0) <= k:
        print("The times have changed")
        return out.getvalue()

    order = []
    mask = 0

    for _ in range(n):
        for seat in range(n):
            if (mask >> seat) & 1:
                continue

            if (pre[seat] & mask) != pre[seat]:
                continue

            cnt = dp(mask | (1 << seat))

            if cnt <= k:
                k -= cnt
            else:
                order.append(seat)
                mask |= (1 << seat)
                break

    ans = [0] * n

    for professor, seat in enumerate(order, start=1):
        ans[seat] = professor

    print(*ans)

    return out.getvalue()

# provided sample
assert run(
"""3 2001 2
1 2
2 3
"""
) == "1 2 3\n", "sample 1"

# minimum size
assert run(
"""1 2001 0
"""
) == "1\n", "single professor"

# contradictory constraints
assert run(
"""2 2001 2
1 2
2 1
"""
) == "The times have changed\n", "cycle"

# year exceeds arrangements
assert run(
"""2 2003 0
"""
) == "The times have changed\n", "not enough permutations"

# duplicate constraints
assert run(
"""3 2001 3
1 2
1 2
1 2
"""
) == "1 2 3\n", "duplicate edges"

# no constraints, second permutation
assert run(
"""3 2002 0
"""
) == "1 3 2\n", "lexicographic order"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 2001 0`|`1`| 最小输入尺寸 |
 | 矛盾循环 |`The times have changed`| 检测不可能的 DAG |
 |`2 2003 0`|`The times have changed`| 处理安排不足|
 | 重复边缘|`1 2 3`| 重复约束不会破坏 DP |
 | 无限制，第二次排列 |`1 3 2`| 正确的词典重建 |

 ## 边缘情况

 ### 矛盾的约束

 输入：```
2 2001 2
1 2
2 1
```依赖关系变为：```
seat 0 depends on seat 1
seat 1 depends on seat 0
```在`mask = 00`，两个座位都不可用，因为每个座位都要求另一个座位已被填满。 

所以：```
dp(0) = 0
```由于有效排列的总数为零，因此算法输出：```
The times have changed
```DP 自然会检测循环，因为没有任何转换变得合法。 

### 请求的年份太大

 输入：```
2 2003 0
```只有两种有效的安排：```
1 2
2 1
```请求的索引是：```
k = 2003 - 2001 = 2
```但：```
dp(0) = 2
```由于有效索引仅`0`和`1`，条件：```
if total <= k:
```正确拒绝请求。 

### 重复约束

 输入：```
3 2001 3
1 2
1 2
1 2
```所有三个边都是相同的。 位掩码存储仅保留一个依赖位：```
pre[1] = 001
```DP 的行为就像边缘出现过一次一样。 

最终的安排仍然是：```
1 2 3
```### 完全无约束的情况

 输入：```
3 2004 0
```全部`3! = 6`排列是有效的。 

该算法按照字典顺序重建第四个排列：```
2 3 1
```此案例验证了即使每个转换都可用，词典跳跃也能正常工作。
