---
title: "CF 102409K - 贷款困境"
description: "一旦我们知道每个人的净头寸，原始贷款就不再重要。 对于每笔贷款 a b c，a 人赠送了 c，而 b 人收到了 c。"
date: "2026-08-12T00:09:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102409
codeforces_index: "K"
codeforces_contest_name: "Semana i 2019"
rating: 0
weight: 102409
solve_time_s: 273
verified: true
draft: false
---

[CF 102409K - 借贷困境](https://codeforces.com/problemset/problem/102409/K)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 一旦我们知道每个人的净头寸，原始贷款就不再重要。 对于每笔贷款`a b c`， 人`a`已经放弃了`c`，而人`b`已收到`c`。 当所有贷款合并后，将一个人的余额定义为他们应该收到的钱减去他们应该支付的钱。 正余额意味着该人必须收到该金额，负余额意味着该人必须支付其绝对值，零余额意味着该人已经结算。 

例如，如果`0`四旬斋`1`五个单位和`1`后来借出`2`五个单位，余额为`0 = +5`,`1 = 0`， 和`2 = -5`。 原来的中间交易就从问题中消失了，因为人`0`可以直接从人那里直接收到五个单位`2`。 

输出是使所有余额为零的任何付款集合。 第一个目标是最大限度地减少转移总量。 一旦达到最佳效果，第二个目标就是最大限度地减少付款次数。 所需的输出格式是付款次数，后跟付款人、收款人和金额。 问题陈述确认原始贷款图可以被结果净余额替换。 

第一个目标有一个简单的特征。 让正余额总和为`P`。 每个正余额的人都必须收到准确的余额，因此每笔有效的结算转账至少`P`单位。 我们可以准确地实现`P`只允许负余额的人向正余额的人付款。 因此，在我们开始优化付款次数之前，最小总金额就已确定。 

困难的部分是第二个目标。 最多18人，这是关键约束。 多项式算法会很令人愉快，但这个问题包含一个类似子集和的选择：当一群人的余额总和为零时，他们可以精确地独立解决。 一般来说，找到此类组的最佳集合是指数级的，所以`N <= 18`这使得位掩码动态程序变得实用。 贷款数量可高达`100000`，但这些贷款只需累积到`N`平衡，因此它们的贡献是线性的`K`。 

直接实现可能会错误处理几种边缘情况。 

考虑两个具有相反平衡的人。```
2 1
1 0 1
```人`0`有平衡`-1`和人`1`有平衡`+1`，所以唯一的付款是`0 1 1`。 如果不小心保留原始贷款方向，则会输出相反的方向，从而无法结算余额。 

现在考虑一个人，尽管出现在许多贷款中，但最终余额为零。```
3 2
0 1 5
1 0 5
```每个余额都为零，因此正确的输出很简单```
0
```将零余额人保留在指数 DP 中不会改变正确性，但它不必要地使每增加一个人的状态空间就增加一倍。 当许多贷款取消时，在 DP 之前删除它们是一个重大的优化。 

更微妙的情况是存在多个独立的零和群。 例如，```
4 2
0 2 2
1 3 2
```给出余额`+2, +2, -2, -2`。 两次付款就足够了，每对内一次。 反复选择任意债务人和债权人的贪婪程序仍然可以解决资金问题，但它可能会忽略参与者分裂成独立部分的事实。 第二个目标就是找到尽可能多的此类独立组件。 

最后，同一对可以出现多次。 输入```
2 100000
0 1 1
0 1 1
...
0 1 1
```重复该行`100000`时间产生平衡`-100000`和`+100000`。 原来的`100000`汇总后贷款无关，只需一次结算。 使用每笔贷款的状态而不是净余额将完全错过使问题变小的结构。 

## 方法

 暴力解决方案可以将非零人的所有可能划分枚举到组中。 对于每个分区，检查每个组的余额总和是否为零。 如果是这样，则包含一个组`s`人们可以使用`s-1`付款，因此付款总数通过具有最大组数的分区来最小化。 这是正确的，因为结算的每个连接组件的总余额必须为零，并且零和组`s`人们总能和解`s-1`付款。 

问题是分区的数量。 18个标记元素的集合划分数就是第18个贝尔数，`682076806159`， 大致`6.82 * 10^11`。 即使检查每个分区的恒定信息量也远远超出了一秒的时间限制。 

蛮力之所以有效，是因为它明确地搜索独立的零和群。 它会失败，因为当大多数信息都是冗余时，它会搜索完整的分区。 有用的观察是，一个组唯一重要的属性是它的余额是否为零。 这让我们可以用位掩码来表示每个人的集合，并为所有较小的掩码重用结果。 

对于面膜来说`S`， 让`sum[S]`为其余额之和。 定义`dp[S]`作为可以在内部找到的成对不相交零和子集的最大数量`S`。 这是一个最大零和子分区，不一定是所有的分区`S`。 

选择任何人`x`在`S`。 如果`S`总和不为零，零和群体的最优集合不可能包含其中的每个人`S`，因为这些组的总和也为零。 在不降低最优值的情况下，至少可以移除一个人。 这样我们就可以采取最好的`dp[S without x]`的所有选择`x`。 

如果`S`其本身总和为零，最佳零和划分`S`包含一些包含的组`x`。 去除`x`完全销毁该组，而其余组形成零和子分区`S without x`。 因此，最佳值比通过去除一个元件获得的掩模的最佳结果大一倍。 

这给出了重现```
dp[S] = max dp[S without x]                         if sum[S] != 0
dp[S] = 1 + max dp[S without x]                    if sum[S] == 0
```全面的`x`在`S`。 这个重复是一个标准`O(n 2^n)`最大零和划分的动态规划公式。 

全套非零余额的总和为零，因此`dp[full]`正是独立零和群的最大数量。 如果有`m`非零人以及`g`组，每组大小`s`需要`s-1`付款。 对各组求和得出```
(s1 - 1) + (s2 - 1) + ... + (sg - 1)
= m - g
```所以最大化`g`与最小化付款次数完全相同。 

DP仅给出最佳组数。 为了恢复实际的组，我们回溯。 选出剩下的一人`x`并枚举包含的子掩码`x`直到找到零和子集`G`满意的```
dp[remaining without G] + 1 = dp[remaining]
```根据 DP 的定义，这样的子集必须存在。 一次`G`发现，将其删除并重复。 

知道分组后，就可以独立解决每个分组了。 在一组内，重复选择一名债务人和一名债权人，并转让较小的剩余金额。 每次付款后，其中至少有一个变为零。 由于小组开始于`s`非零余额并以所有余额为零结束`s-1`付款产生。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(B_n * n)`|`O(n)`| 太慢了|
 | 最佳 |`O(K + n 2^n)`|`O(2^n)`| 已接受 |

 这里`B_n`是第n个贝尔数，而最优方法只使用`2^n`最多戴口罩和检查`n`每个掩码的转换。 

## 算法演练

 1. 阅读每笔贷款并累积净余额。 为了贷款`a b c`， 添加`c`到`balance[a]`并减去`c`从`balance[b]`， 因为`a`有权收到退款，同时`b`欠它的。 
2. 删除所有最终余额为零的人。 这样的人不参与任何必需的结算，并且排除他们会减少位掩码维度而不改变答案。 
3.将剩余余额存储在一个length数组中`m`。 由于每一笔原始贷款都将资金从一个人转移到另一个人，因此所有余额的总和为零。 
4. 计算`sum[mask]`对于每个子集。 删除最低设置位`mask`，重用已经计算出的较小掩码的总和，并添加相应的余额。 这计算了所有子集总和`O(2^m)`时间。 
5. 初始化`dp[0] = 0`。 对于每个非空掩码，删除每个可能的设置位并从较小的掩码继承最佳结果。 如果当前掩码的和为零，则向候选者加一，因为当前掩码本身可以形成一个零和组。 
6. 阅读`dp[full]`作为独立零和群的最大可能数量。 由于一组`s`人们确实需要`s-1`付款，最少付款次数为`m - dp[full]`。 
7. 重建群体。 取最低设置位`x`当前掩码并枚举其子掩码。 查找子掩码`G`含有`x`其总和为零并且对于`dp[current without G] + 1`等于`dp[current]`。 这标识了最佳分区使用的一组。 
8. 删除`G`从当前的面具开始并继续，直到没有人留下。 重构最多考虑`m`组，每个重建阶段最多检查`2^m`子掩码，对于`m <= 18`。 
9. 对于每个已收回的组，将其成员分为负余额的债务人和正余额的债权人。 将一名债务人与一名债权人匹配，并转移较小的绝对余额。 
10. 每次付款后更新剩余余额。 如果债务人达到零，则前进到下一个债务人。 如果债权人达到零，则前进到下一个债权人。 每次迭代至少有一个指针前进，因此一组大小`s`准确生成`s-1`付款。 

### 为什么它有效

 关键的不变量是`dp[mask]`等于可以从中选择的不相交零和群的最大数量`mask`。 如果`mask`不是零和的，每个零和子分区都会留下至少一个人未被使用，因此删除一个合适的人可以保留最佳状态。 如果`mask`是零和游戏，取包含任何选定人的组。 删除该人会使所有其他群体完好无损，因此最佳选择是`mask`正好比相应较小掩模的最佳值大 1。 这通过掩模尺寸的归纳证明了重现性。 

对于整个集合，所有非零人本身的总和为零，因此最佳子分区实际上是每个人的分区。 如果它包含`g`团体和`m`人们，这些群体需要`m-g`付款。 最大化`g`从而最大限度地减少付款次数。 

最终的贪婪结算在每个选定组内都是正确的，因为每次付款仅将资金从债务人转移到债权人，因此总转移金额恰好是正余额之和。 这是可能的最小总传输量。 每笔付款至少使一项剩余余额为零，最后一笔付款使最后两项余额为零，从而准确地给出`s-1`为一组人付款`s`人们。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve(data: str) -> str:
    it = iter(map(int, data.split()))
    try:
        n = next(it)
        k = next(it)
    except StopIteration:
        return ""

    balance = [0] * n

    for _ in range(k):
        a = next(it)
        b = next(it)
        c = next(it)

        balance[a] += c
        balance[b] -= c

    people = []
    vals = []

    for person, value in enumerate(balance):
        if value != 0:
            people.append(person)
            vals.append(value)

    m = len(vals)

    if m == 0:
        return "0\n"

    size = 1 << m

    subset_sum = [0] * size

    for mask in range(1, size):
        bit = mask & -mask
        idx = bit.bit_length() - 1
        subset_sum[mask] = subset_sum[mask ^ bit] + vals[idx]

    dp = [0] * size

    for mask in range(1, size):
        best = 0
        bits = mask

        if subset_sum[mask] == 0:
            while bits:
                bit = bits & -bits
                candidate = dp[mask ^ bit] + 1
                if candidate > best:
                    best = candidate
                bits ^= bit
        else:
            while bits:
                bit = bits & -bits
                candidate = dp[mask ^ bit]
                if candidate > best:
                    best = candidate
                bits ^= bit

        dp[mask] = best

    groups = []
    mask = size - 1

    while mask:
        first = mask & -mask
        sub = mask

        while sub:
            if (sub & first) and subset_sum[sub] == 0:
                rest = mask ^ sub
                if dp[rest] + 1 == dp[mask]:
                    groups.append(sub)
                    mask = rest
                    break
            sub = (sub - 1) & mask

    answer = []

    for group in groups:
        debtors = []
        creditors = []

        bits = group
        while bits:
            bit = bits & -bits
            idx = bit.bit_length() - 1

            if vals[idx] < 0:
                debtors.append([idx, -vals[idx]])
            else:
                creditors.append([idx, vals[idx]])

            bits ^= bit

        i = 0
        j = 0

        while i < len(debtors) and j < len(creditors):
            debtor, owe = debtors[i]
            creditor, receive = creditors[j]

            amount = min(owe, receive)

            answer.append((people[debtor], people[creditor], amount))

            owe -= amount
            receive -= amount

            debtors[i][1] = owe
            creditors[j][1] = receive

            if owe == 0:
                i += 1
            if receive == 0:
                j += 1

    out = [str(len(answer))]
    out.extend(f"{a} {b} {c}" for a, b, c in answer)
    return "\n".join(out) + "\n"

def main():
    data = sys.stdin.buffer.read().decode()
    sys.stdout.write(solve(data))

if __name__ == "__main__":
    main()
```输入部分使用`sys.stdin.buffer.read()`而不是反复调用`input()`。 高达`100000`贷款，一次读取整个输入既简单又快速，而实际算法仍然只有`O(N)`财务状况。 

余额更新使用`balance[a] += c`和`balance[b] -= c`。 颠倒这些符号是错误答案的常见来源，因为输入描述了历史贷款方向，而输出描述了最终还款的方向。 

零余额的人在构建面具之前就被过滤了。 最后，`m`可以小于`N`，每个掩码位对应一个实际的非零余额。 当所有余额为零时，该函数立即返回，并且永远不会使用特殊的重建逻辑创建零大小的 DP 数组。 

子集和数组使用最低设置位。 如果`bit`是那一点，那么`mask ^ bit`包含所有其他人，所以`subset_sum[mask]`可以根据先前计算的一项来计算。 值可以达到大约`10^8`，因此 Python 整数可以轻松处理它们而不会溢出。 

DP 转换有意考虑每个设置位，而不是仅选择一个固定位。 该证明保证至少一个选择保留最佳子分区，并且考虑所有选择让递归发现该选择。 

重建与 DP 是分开的，因为递归仅存储最优计数，而不存储每个零和组的标识。 在重建过程中枚举子掩码是可以承受的，因为最多有 18 个非零人。 它也比尝试从 DP 转换删除的位推断一组更安全，因为该位本身并不识别相应的零和分量。 

最终的和解不改变原有的`vals`大批。 它适用于小型可变的`[person, amount]`每组内配对。 这很有用，因为 DP 描述了最优分区，而结算阶段只需要为该分区构建一个有效的支付序列。 

## 工作示例

 ### 示例 1

 输入是```
2 1
1 0 1
```贷款造人`1`债权人和个人`0`债务人。 

| 状态| 价值|
 | ---| ---|
 |`balance[0]`|`-1`|
 |`balance[1]`|`+1`|
 | 非零余额 |`[-1, +1]`|
 |`sum[01]`|`0`|
 |`dp[01]`|`1`|
 | 康复组|`{0, 1}`|

 已收回的组包含一名债务人和一名债权人。 人`0`付钱人`1`一个单位。```
1
0 1 1
```转账总额为1，这是不可避免的，因为人`1`必须收到一个单位。 该团体包含两人，因此一笔付款也是最少可能的计数。 

### 示例 2

 输入是```
3 4
2 0 2
1 0 1
1 0 1
2 0 1
```这四笔贷款的净余额如下。 

| 人 | 平衡|
 | ---| ---|
 |`0`|`-5`|
 |`1`|`+2`|
 |`2`|`+3`|

 有三个非零人，因此掩码空间只有八种状态。 

| 面膜| 人物 | 总和|`dp`|
 | ---| ---| ---| ---|
 |`001`|`0`|`-5`|`0`|
 |`010`|`1`|`+2`|`0`|
 |`100`|`2`|`+3`|`0`|
 |`011`|`0,1`|`-3`|`0`|
 |`101`|`0,2`|`-2`|`0`|
 |`110`|`1,2`|`+5`|`0`|
 |`111`|`0,1,2`|`0`|`1`|

 不存在适当的零和子集，因此所有三个人组成一组。 结算阶段匹配债务人`0`与债权人`1`两个单位，然后与债权人`2`三个单位。```
2
0 1 2
0 2 3
```该样本以相反的债权人顺序使用相同的两次付款，这同样是最优的。 

该跟踪说明了为什么 DP 必须区分零和群体和任意的人群集合。 整个集合是零和的，因此它贡献一个独立的分量，而没有一个真子集可以独立解决。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(K + m 2^m)`|`O(K)`计算余额，`O(2^m)`对于子集和，`O(m 2^m)`对于 DP，以及`O(m 2^m)`最坏的情况下重建|
 | 空间|`O(2^m + N)`| 子集和和 DP 各自包含`2^m`条目，而余额数组包含`O(N)`条目 |

 自从`m <= N <= 18`, 最多有`262144`面具。 主要 DP 的执行情况大致低于`18 * 262144`， 或者`4.7 million`，位转换。 重建具有相同的指数规模，并且在此范围内仍然实用。 这`100000`输入贷款仅添加线性预处理过程，因此该解决方案非常适合预期的小规模`N`， 大的-`K`问题的结构。 

## 测试用例

 下面的测试使用相同的`solve`作为提交的解决方案。 由于该问题接受任何最佳支付序列，因此比较此实现的确定性输出对于这些固定测试来说就足够了。```python
import io
import sys

def solve(data: str) -> str:
    it = iter(map(int, data.split()))

    n = next(it)
    k = next(it)

    balance = [0] * n

    for _ in range(k):
        a = next(it)
        b = next(it)
        c = next(it)
        balance[a] += c
        balance[b] -= c

    people = []
    vals = []

    for person, value in enumerate(balance):
        if value:
            people.append(person)
            vals.append(value)

    m = len(vals)

    if m == 0:
        return "0\n"

    size = 1 << m
    subset_sum = [0] * size

    for mask in range(1, size):
        bit = mask & -mask
        idx = bit.bit_length() - 1
        subset_sum[mask] = subset_sum[mask ^ bit] + vals[idx]

    dp = [0] * size

    for mask in range(1, size):
        best = 0
        bits = mask

        while bits:
            bit = bits & -bits
            candidate = dp[mask ^ bit]

            if subset_sum[mask] == 0:
                candidate += 1

            if candidate > best:
                best = candidate

            bits ^= bit

        dp[mask] = best

    groups = []
    mask = size - 1

    while mask:
        first = mask & -mask
        sub = mask

        while sub:
            if (sub & first) and subset_sum[sub] == 0:
                rest = mask ^ sub
                if dp[rest] + 1 == dp[mask]:
                    groups.append(sub)
                    mask = rest
                    break
            sub = (sub - 1) & mask

    answer = []

    for group in groups:
        debtors = []
        creditors = []

        bits = group
        while bits:
            bit = bits & -bits
            idx = bit.bit_length() - 1

            if vals[idx] < 0:
                debtors.append([idx, -vals[idx]])
            else:
                creditors.append([idx, vals[idx]])

            bits ^= bit

        i = 0
        j = 0

        while i < len(debtors) and j < len(creditors):
            debtor, owe = debtors[i]
            creditor, receive = creditors[j]

            amount = min(owe, receive)

            answer.append(
                (people[debtor], people[creditor], amount)
            )

            debtors[i][1] -= amount
            creditors[j][1] -= amount

            if debtors[i][1] == 0:
                i += 1
            if creditors[j][1] == 0:
                j += 1

    out = [str(len(answer))]
    out.extend(f"{a} {b} {c}" for a, b, c in answer)
    return "\n".join(out) + "\n"

def run(inp: str) -> str:
    return solve(inp)

assert run(
    """2 1
1 0 1
"""
) == """1
0 1 1
""", "sample 1"

assert run(
    """3 4
2 0 2
1 0 1
1 0 1
2 0 1
"""
) == """2
0 1 2
0 2 3
""", "sample 2"

assert run(
    """1 0
"""
) == """0
""", "minimum size with no loans"

assert run(
    """4 2
0 2 2
1 3 2
"""
) == """2
3 0 2
2 1 2
""", "two independent equal groups"

assert run(
    """3 1
0 1 1
"""
) == """1
1 0 1
""", "zero-balance participant"

large_input = "2 100000\n" + ("0 1 1\n" * 100000)

assert run(large_input) == """1
0 1 100000
""", "maximum K and large aggregated balance"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 1 / 1 0 1`|`1 / 0 1 1`| 直接债务人-债权人方向 |
 |`3 4 / sample 2`|`2 / 0 1 2 / 0 2 3`| 单个三人零和组件 |
 |`1 0`|`0`| 空沉降和最小可能`N`|
 |`4 2 / 0 2 2 / 1 3 2`|`2 / 3 0 2 / 2 1 2`| 多个独立的零和群|
 |`3 1 / 0 1 1`|`1 / 1 0 1`| 最终余额为零的人被删除 |
 |`2 100000`与重复的`0 1 1`|`1 / 0 1 100000`| 大的`K`、重复贷款汇总、大额余额|

 ## 边缘情况

 直接相反的对是最简单的零和群。 为了```
2 1
1 0 1
```汇总后的余额为`[-1, +1]`。 完整掩码的总和为零，因此`dp[full] = 1`。 重建将这两个人选为一组。 结算阶段寻找债务人`0`和债权人`1`，转移一个单位，两个余额都变为零。 输出是```
1
0 1 1
```余额为零的人不得创建虚假交易。 为了```
3 2
0 1 5
1 0 5
```两笔贷款完全取消，留下余额`[0, 0, 0]`。 过滤步骤删除了每个人，所以`m = 0`并且算法立即输出```
0
```这也是为什么 DP 应该从非零余额而不是所有余额构建的原因`N`人们。 

独立的零和组件是击败任意贪婪匹配的核心情况。 为了```
4 2
0 2 2
1 3 2
```余额是`[+2, +2, -2, -2]`。 最优划分有两组，`{0,3}`和`{1,2}`。 每组需要一笔付款，所以最终答案有两笔交易：```
2
3 0 2
2 1 2
```总转账金额为四，等于正余额之和，并且两次付款是最佳的，因为每个独立对已经需要一次。 

重复贷款体现了投入规模和国家规模之间的区别。 和`100000`的副本`0 1 1`，余额变为`[-100000, +100000]`。 DP 仍然只包含四个面具，因为只有两个非零人。 重建生产一组，结算阶段一笔付款`100000`:```
1
0 1 100000
```原来的`100000`每笔贷款都会处理一次，但它们都不会创建单独的 DP 状态。 

最终的边界情况是隐藏在零余额人群中的单个非零对。 为了```
3 1
0 1 1
```余额是`[+1, -1, 0]`。 人`2`被丢弃，留下二元 DP 状态`[+1, -1]`。 由此产生的付款是```
1
1 0 1
```零余额参与者在结算中没有任何作用，位掩码索引仅涉及剩下的两个人，因此在重建过程中必须单独保留原始人员ID。
