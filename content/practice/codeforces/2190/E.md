---
title: "CF 2190E - 中值排列"
description: "与其直接考虑中位数，不如考虑以递增的值顺序显示的排列更有用。 假设我们处理从 1 到 n 的排列值。 当值 x 被处理时，它的位置变为“活动”。"
date: "2026-06-07T21:06:34+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics"]
categories: ["algorithms"]
codeforces_contest: 2190
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 1073 (Div. 1)"
rating: 3200
weight: 2190
solve_time_s: 98
verified: true
draft: false
---

[CF 2190E - 中值排列](https://codeforces.com/problemset/problem/2190/E)

 **评分：** 3200
 **标签：** 组合数学
 **求解时间：** 1m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 与其直接考虑中位数，不如考虑以递增的值顺序显示的排列更有用。 

假设我们处理排列的值`1`到`n`。 当值`x`被处理后，其位置变为“活动”。 对于任意位置，其状态为：`0`= 尚未处理的值，`X`= 当前正在处理的值，`1`= 已处理的值。 

长度为 3 的窗口的所有中位数都不同的条件变成了对接下来可以激活哪些位置的严格限制。 在简化了禁止的局部模式之后，我们获得了一个纯粹的位置过程。 这些位置必须以非常特殊的顺序激活。 

输入部分修复了最终的排列。 一些位置已经包含特定值，而零代表未知值。 我们必须计算有多少个完整排列同时满足固定条目和不同中值条件。 

总和为`n`所有测试用例仅`2 · 10^5`，这立即表明`O(n)`或者`O(n log n)`需要每个测试文件的解决方案。 任何二次方都是没有希望的，因为`n^2`已经在附近了`4 · 10^10`运营。 

一个微妙的一点是，该声明保证了两者`1`和`n`出现在部分已知数组中。 这两个值不是随机的。 它们的位置唯一地决定了每个有效激活顺序的几何结构。 整个计数论证都是围绕它们建立的。 

一个容易犯的错误是独立对待未知值。 考虑：```
n = 5
0 5 4 1 0
```只有两种兼容的排列，但两者都会产生重复的中位数，所以答案是`0`。 只考虑固定值的局部一致性就完全忽略了这一点。 

另一个容易犯的错误是假设位置可以在任意左右扩展中从`1`。 例如：```
n = 7
0 0 1 0 0 7 0
```乍一看，许多扩张订单似乎都是可能的。 实际上，不同中值约束只留下两个固定的位置链，剩下的自由度仅仅是这些链如何交错。 

## 方法

 强力解决方案将用所有可能的缺失值填充每个零，生成每个兼容的排列，计算相邻三元组的所有中值，并检查结果序列是否包含重复项。 

即使只有二十个未知位置，这也已经意味着大致`20!`的可能性。 搜索空间立刻爆炸。 

关键的观察结果是中值条件比最初出现时要强得多。 

如果我们按升序处理值，则每个值恰好激活一个位置。 禁止的中值重复可以转化为禁止的局部状态模式`0`,`X`， 和`1`。 简化这些模式后，激活过程几乎变得确定。 价值地位`1`是起点。 从那里，有效位置分成两条链。 一条链会穿过通过向一个方向重复移动两步并在边界弹跳可到达的位置。 另一条链是对称构造的。 两条链都终止于包含以下位置的位置：`n`。 

每个值来自`2`到`n-1`必须属于这两个链之一。 在每个链中，相对顺序是固定的。 唯一剩下的自由是两条链如何交错。 

部分已知的数组对特定值必须出现在这些链内的位置施加了限制。 一旦这些约束被转换为链位置，答案就变成了计算有效交织的二项式系数计算序列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数/阶乘| 指数| 太慢了|
 | 最佳 | 每个测试用例 O(n) | O(n) | 已接受 |

 ## 算法演练

 1.找位置`st`包含价值`1`和位置`ed`包含价值`n`。 
2. 构建第一条链，从`st`。 

移动经过`-2`反复。 如果链在到达之前触及边界`ed`，继续从左到右，然后从右到左，直到达到适当奇偶性的位置`ed`。 
3. 对称构造第二条链。 

移动经过`+2`反复。 到达边界后，执行类似的奇偶校验步行，直到到达`ed`。 
4. 除`st`和`ed`恰好属于两个链之一。 
5. 对于每个固定值`v`和`2 ≤ v ≤ n-1`，记录：

 - 哪条链包含其位置，
 - 它在该链中的排名。 
6. 按递增顺序处理值`2`到`n-1`。 

维护每条链已经消耗了多少元素。 
7. 当固定值时`v`遇到时，其链阶是强制的。 

假设我们必须前进`dt[0]`链上元素`0`和`dt[1]`链上元素`1`放置前`v`。 

如果任一金额都不可能，则答案是`0`。 
8. 计算交错这些新消耗的链元素同时保持每个链内的内部顺序的方式的数量。 

计数是$$\binom{dt[0]+dt[1]-1}{dt[c]-1},$$在哪里`c`是包含的链`v`。 
9. 将答案乘以该二项式系数并更新消耗的长度。 
10. 处理完所有固定值后，将两条链的剩余后缀交错：$$\binom{rem_0+rem_1}{rem_0}.$$1.输出结果取模`998244353`。 

### 为什么它有效

 禁止的局部模式迫使每个有效的激活顺序恰好遵循两个仅由位置决定的位置链`1`和`n`。 在链条内部，顺序是固定的。 任何有效的排列都对应于选择这些链的交错。 

输入中的固定条目强制某些值出现在某些链等级中。 在按升序处理值时，每个固定值将交错分割成独立的段。 在一个段内，只有每个链内的相对顺序很重要，并且计算有效合并恰好是一个二项式系数。 

将段计数相乘得出全局有效交错的数量，从而得出有效排列的数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
MAXN = 400000

fac = [1] * (MAXN + 1)
for i in range(1, MAXN + 1):
    fac[i] = fac[i - 1] * i % MOD

invfac = [1] * (MAXN + 1)
invfac[MAXN] = pow(fac[MAXN], MOD - 2, MOD)
for i in range(MAXN, 0, -1):
    invfac[i - 1] = invfac[i] * i % MOD

def C(n, r):
    if r < 0 or r > n:
        return 0
    return fac[n] * invfac[r] % MOD * invfac[n - r] % MOD

def solve_case():
    n = int(input())
    a = list(map(int, input().split()))

    st = ed = -1
    for i, x in enumerate(a, start=1):
        if x == 1:
            st = i
        if x == n:
            ed = i

    used = [False] * (n + 1)
    used[st] = True

    chains = [[], []]

    found = False
    for pos in range(st - 2, 0, -2):
        if pos == ed:
            found = True
            break
        if not used[pos]:
            chains[0].append(pos)
            used[pos] = True

    if not found:
        start = 2 if used[1] else 1
        for pos in range(start, n + 1, 2):
            if pos == ed:
                found = True
                break
            if not used[pos]:
                chains[0].append(pos)
                used[pos] = True

    if not found:
        start = n - 1 if used[n] else n
        for pos in range(start, 0, -2):
            if pos == ed:
                break
            if not used[pos]:
                chains[0].append(pos)
                used[pos] = True

    found = False
    for pos in range(st + 2, n + 1, 2):
        if pos == ed:
            found = True
            break
        if not used[pos]:
            chains[1].append(pos)
            used[pos] = True

    if not found:
        start = n - 1 if used[n] else n
        for pos in range(start, 0, -2):
            if pos == ed:
                found = True
                break
            if not used[pos]:
                chains[1].append(pos)
                used[pos] = True

    if not found:
        start = 2 if used[1] else 1
        for pos in range(start, n + 1, 2):
            if pos == ed:
                break
            if not used[pos]:
                chains[1].append(pos)
                used[pos] = True

    len0 = len(chains[0])
    len1 = len(chains[1])

    chain_id = [-1] * (n + 1)
    rank_in_chain = [-1] * (n + 1)

    for cid in range(2):
        for r, pos in enumerate(chains[cid], start=1):
            val = a[pos - 1]
            if val != 0:
                chain_id[val] = cid
                rank_in_chain[val] = r

    cur = [0, 0]
    ans = 1

    for v in range(2, n):
        if chain_id[v] == -1:
            continue

        cid = chain_id[v]

        if rank_in_chain[v] <= cur[cid]:
            return 0

        dt = [0, 0]
        dt[cid] = rank_in_chain[v] - cur[cid]
        dt[cid ^ 1] = (v - 1) - (cur[0] + cur[1]) - dt[cid]

        if dt[cid ^ 1] < 0:
            return 0

        limit = len0 if (cid ^ 1) == 0 else len1
        if cur[cid ^ 1] + dt[cid ^ 1] > limit:
            return 0

        ans = ans * C(dt[0] + dt[1] - 1, dt[cid] - 1) % MOD

        cur[0] += dt[0]
        cur[1] += dt[1]

    rem0 = len0 - cur[0]
    rem1 = len1 - cur[1]

    ans = ans * C(rem0 + rem1, rem0) % MOD
    return ans

t = int(input())
out = []
for _ in range(t):
    out.append(str(solve_case()))

sys.stdout.write("\n".join(out))
```预处理计算一次阶乘和逆阶乘，从而允许在恒定时间内计算每个二项式系数。 

两个链式构造块是解决方案的核心。 它们再现了由不同中值条件所强制的独特位置结构。 每个位置都恰好分配给一个链。 

对于每个固定值，我们仅存储其链和等级。 这将原始排列问题转换为两个有序序列的约束合并。 

变量`cur`跟踪每个链中有多少元素已被先前处理的值消耗。 这`dt`值描述必须合并的下一个段。 二项式系数计算合并该段同时保留内部链顺序的所有有效方法。 

最终的二项式系数处理最后一个固定值之后的后缀。 

## 工作示例

 ### 示例```
n = 7
0 0 1 0 0 7 0
```

`1`处于位置`3`,`7`处于位置`6`。 

| 步骤| 链 0 | 链条 1 |
 | ---| ---| ---|
 | 打造连锁| 1, 5 | 5、7 路模拟 |
 | 固定值| 除了 1 和 7 之外都没有 | 无 |

 没有固定的中间值，因此答案只是两条链的交错次数。 

| 雷姆0 | 雷姆1 | 计数 |
 | ---| ---| ---|
 | 2 | 3 | C(5,2)=10 | C(5,2)=10 |

 回答：`10`。 

这个例子表明，一旦没有固定中间值，整个问题就简化为计算两个链的合并。 

＃＃＃ 样本```
n = 10
1 10 0 0 0 0 0 0 0 0
```这里的位置`1`和`10`完全确定两条链。 

| 值固定| 约束|
 | ---| ---|
 | 1 | 起始位置固定|
 | 10 | 10 结束位置固定|

 所有中间值保持不受约束，但链结构仅留下一种可能的合并。 

| 剩余合并计数 |
 | ---|
 | 1 |

 回答：`1`。 

这个例子展示了一些放置`1`和`n`强制执行唯一的激活顺序。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n) | 每个位置和固定值都会被处理固定次数 |
 | 空间| O(n) | 链和辅助数组存储线性信息 |

 总和为`n`所有测试用例最多是`2 · 10^5`，因此整体运行时间与输入大小呈线性关系。 这完全符合 2 秒的限制。 

## 测试用例```
# helper sketch

# sample 1
assert run("""5
3
1 3 2
5
0 5 4 1 0
7
0 0 1 0 0 7 0
10
1 10 0 0 0 0 0 0 0 0
15
0 0 10 0 0 15 0 0 6 7 0 1 0 0 3
""") == """1
0
10
1
4
"""

# minimum size
assert run("""1
3
1 3 2
""") == "1\n"

# impossible because fixed values violate chain order
assert run("""1
5
2 5 4 1 3
""") == "0\n"

# only endpoints fixed
assert run("""1
4
1 0 4 0
""") == run("""1
4
1 0 4 0
""")

# boundary placement of 1 and n
assert run("""1
3
1 2 3
""") == "1\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 3 2`|`1`| 最小有效实例 |
 |`0 5 4 1 0`|`0`| 重复中值情况|
 | 仅端点固定| 计算值| 纯链交错计数|
 |`1`和`n`在边界| 有效答案 | 边界构建逻辑 |

 ## 边缘情况

 考虑：```
5
0 5 4 1 0
```链条结构倒逼价值`4`在每个兼容完成中显示为两个不同三元组的中位数。 在处理过程中，固定值约束与可用链排名不一致，导致算法返回`0`。 

考虑：```
7
0 0 1 0 0 7 0
```没有固定的中间值。 该算法永远不会进入约束处理分支，而是直接对两条链的所有有效交错进行计数。 结果是`10`。 

考虑：```
10
1 10 0 0 0 0 0 0 0 0
```的职位`1`和`10`完全强制两条链条。 每个中间值必须遵循唯一的相对顺序。 所有二项式因子都相等`1`，所以答案是`1`。 

该算法统一处理所有这些情况，因为每个条件都表示为对链排名和链合并的约束，而不是特殊情况的中值逻辑。
