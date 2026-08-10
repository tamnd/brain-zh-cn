---
title: "CF 102443G - 连字符过多"
description: "我们有一个仅由 + 和 - 组成的字符串。 我们可以在任何地方插入大括号，而不改变原始字符。"
date: "2026-08-09T01:43:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102443
codeforces_index: "G"
codeforces_contest_name: "2019-2020 Russia Team Open, High School Programming Contest (VKOSHP 19)"
rating: 0
weight: 102443
solve_time_s: 110
verified: true
draft: false
---

[CF 102443G - 连字符过多](https://codeforces.com/problemset/problem/102443/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一根仅由以下材料制成的绳子`+`和`-`。 我们可以在任何地方插入大括号，而不改变原始字符。 插入后，大括号本身必须形成有效的括号序列：从左到右扫描，大括号的数量`{`字符数不得小于`}`，并且最后两个计数必须相等。 

插入大括号的原因是为了分隔每对相邻的连字符。 在最终字符串中，每两个连续的原始字符串之间`-`字符必须至少有一个大括号。 连续的`+`角色不需要任何特殊处理。 

在所有有效字符串中，我们只保留那些使用尽可能少的大括号的字符串。 这些是最佳转义字符串。 它们使用以下顺序按字典顺序排序`+ < - < { < }`，任务是输出`k`-第一个。 如果少于`k`最优字符串存在，我们打印`Overflow`。 原始输入字符串最多有 60 个字符，而`k`可以大到`10^18`。 

第一个有用的数量是数字`r`两个连续原始字符同时存在的位置`-`。 每个这样的位置必须至少包含一个插入的大括号。 因此至少`r`大括号是必要的。 然而，大括号必须形成平衡的序列，因此它们的总数必须是偶数。 因此，大括号的最小数量至少是最小的偶数`r`。 

例如，与`s = "--"`，存在一个禁止邻接，因此至少需要一个大括号。 一个大括号无法形成平衡的序列，因此最佳使用两个大括号。 三个最优字符串是`-{-}`,`-{}-`， 和`{-}-`。 如果粗心的解决方案只是在所需位置使用一个支撑，就会违反平衡支撑条件。 

另一个边缘情况是没有连续连字符的字符串。 例如，与```
-+-+
2
```没有什么可以逃避的，所以唯一的最佳字符串是`-+-+`。 自从`k = 2`，正确的输出是`Overflow`。 始终插入一对大括号的解决方案是错误的，因为任务要求插入的大括号的最小数量。 这也是官方样品之一。 

字符串开头和结尾的空白位置也是大括号的合法位置。 为了`s = "--"`, 字符串`{-}-`即使它的大括号不在两个连字符之间，也是最佳的。 左大括号位于第一个连字符之前，右大括号位于连字符之间，因此所需的间隙仍然受到保护，并且大括号保持平衡。 仅考虑将大括号直接插入到坏间隙中的实现会错过该字符串。 

对于状态具有多个维度的动态程序来说，60 的长度界限足够小，但对于枚举所有可能的转义字符串来说又太大了。 价值`k <= 10^18`还告诉我们计数应限制在`10^18`：一旦一个状态至少有那么多完成，它的确切较大值永远不会影响答案。 

## 方法

 直接的暴力解决方案可以尝试插入大括号的所有可能方法，检查生成的大括号序列是否平衡，检查每对连续的连字符，然后仅保留具有最少数量的大括号的字符串。 这是正确的，因为考虑了所有可能的转义字符串。 问题在于搜索空间。 原始字符最多为 60 个，在最坏的情况下，最佳解决方案最多有 60 个大括号。 具有四个可能输出字符的逐字符搜索树的深度高达 120，给出了粗略的上限

 [
 1 + 4 + 4^2 + \点 + 4^{120}
 = \frac{4^{121}-1}{3},
 ]

 大致是`2^240 / 3`节点。 即使对有效平衡括号字符串进行更仔细的暴力枚举也是指数级的。 对于 60 个括号，已经存在加泰罗尼亚数字规模的可能性，远远超出了一秒钟所能生成的范围。 

暴力破解之所以有效，是因为每个选择都可以在本地进行检查，并且最终的有效性条件很简单。 它失败了，因为许多不同的前缀具有完全相同的未来可能性。 例如，一旦我们知道已经消耗了多少原始字符、插入了多少大括号、当前的大括号平衡以及当前间隙是否已经收到大括号，那么该点之前的确切历史记录就不再重要。 

这一观察结果将问题转化为有限状态动态程序。 我们计算每个此类状态的最佳完成次数。 一旦这些计数可用，字典序取消排序就变得简单了：在每个位置，我们按所需顺序考虑可能的下一个字符`+`,`-`,`{`,`}`，询问有多少个完整的最佳字符串以每个选择开头，然后接受该选择或跳过其整个块。 

唯一微妙的一点是如何表现原始角色之间的差距。 认为`i`原始字符已经发出。 我们目前正在填补之前的空白`s[i]`，或最终间隙`i == n`。 如果`s[i-1]`和`s[i]`都是`-`，在我们被允许发出之前，这个间隙必须至少接收一个大括号`s[i]`。 单个布尔值记录这是否已经发生。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数为`n`| 指数为`n`| 太慢了|
 | 最佳 |`O(n B²)`|`O(n B²)`| 已接受 |

 这里`B`是括号的最小数量并且`B <= 60`。 

## 算法演练

 1. 计算每个相邻的对`s[i - 1] = s[i] = '-'`。 拨打这个号码`r`。 每个这样的间隙都需要至少一个大括号，因此任何有效的解决方案都不能使用少于`r`大括号。 
2. 计算`B`，大括号的最小数量，作为大于或等于的最小偶数`r`。 大括号形成平衡的括号序列，因此它们的总数必须是偶数。 价值`B`总是可以实现的：将至少一个大括号分配给每个所需的间隙，并使用剩余的大括号来完成平衡序列。 
3. 定义动态规划状态`(i, balance, used, has)`。 这里`i`是已经发出的原始字符数，`balance`是当前未匹配的数量`{`人物，`used`是迄今为止插入的大括号的总数，并且`has`告知当前间隙是否已包含至少一个大括号。 
4.从一个状态，考虑插入`{`。 当少于`B`已使用大括号。 它增加了`balance`，增加`used`，并将当前间隙标记为有大括号。 
5.考虑插入`}`。 仅当以下情况时这才合法`balance > 0`并且少于`B`已使用大括号。 它减少了`balance`，增加`used`，并将当前间隙标记为有大括号。 无法在平衡零处发出右大括号，因为这会使大括号序列无效。 
6.考虑发出下一个原始字符`s[i]`。 仅当当前间隙不是所需的连字符间隙之一，或者`has`已经是真的了。 发出原始字符后，前进`i`并重置`has`为 false，因为我们已经进入了下一个间隙。 
7. 当所有原始字符都发出后，就达到终止状态。 那时，只有准确地陈述`B`插入的大括号和平衡零有效。 最后的间隙允许包含大括号，因此 DP 会继续插入大括号，即使`i == n`。 
8. 记住每个状态的有效完成次数。 自从`k`至多是`10^18`，每个计数上限为`10^18`。 大于此的计数对于决定哪一侧是无法区分的`k`他们躺着。 
9. 在构造答案之前，检查初始状态的计数。 如果它小于`k`， 打印`Overflow`。 
10. 否则，从左到右构造答案。 在每个状态，按字典顺序检查可能的下一个字符。 为了`+`或者`-`，至多有一个原始角色选择。 为了`{`和`}`，DP 给出获取该角色后的完成次数。 如果一个分支包含少于`k`字符串，减去该计数`k`并尝试下一个字符。 否则，追加该字符并移至该状态。 

不变的是，每个 DP 状态准确地表示可能影响未来有效性的信息：原始字符串剩余的数量、可用的大括号数量、当前的括号平衡以及当前所需的间隙是否已受到保护。 因此，每个合法的延续都只计算一次。 在取消排名期间，字典顺序将所有补全根据其下一个字符划分为连续的块，因此跳过完整的块并下降到包含的块`k`始终选择正确的字符串。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

LIMIT = 10**18

def solve():
    s = input().strip()
    k = int(input())
    n = len(s)

    required = 0
    for i in range(1, n):
        if s[i - 1] == '-' and s[i] == '-':
            required += 1

    B = required
    if B % 2:
        B += 1

    memo = {}

    def add_cap(a, b):
        x = a + b
        return LIMIT if x > LIMIT else x

    def count(i, balance, used, has):
        key = (i, balance, used, has)
        if key in memo:
            return memo[key]

        if used > B or balance > B:
            return 0

        if i == n:
            if used == B and balance == 0:
                return 1

            if used == B:
                return 0

        ans = 0

        # Try inserting '{'.
        if used < B:
            ans = add_cap(ans, count(i, balance + 1, used + 1, True))

        # Try inserting '}'.
        if used < B and balance > 0:
            ans = add_cap(ans, count(i, balance - 1, used + 1, True))

        # Try emitting the next original character.
        if i < n:
            required_gap = (
                i > 0 and
                s[i - 1] == '-' and
                s[i] == '-'
            )

            if not required_gap or has:
                ans = add_cap(ans, count(i + 1, balance, used, False))

        memo[key] = ans
        return ans

    total = count(0, 0, 0, False)

    if total < k:
        print("Overflow")
        return

    ans = []
    i = 0
    balance = 0
    used = 0
    has = False

    while not (i == n and used == B and balance == 0):
        choices = []

        # Original character, if legal.
        if i < n:
            required_gap = (
                i > 0 and
                s[i - 1] == '-' and
                s[i] == '-'
            )

            if not required_gap or has:
                choices.append((s[i], (i + 1, balance, used, False)))

        # Opening brace.
        if used < B:
            choices.append(('{', (i, balance + 1, used + 1, True)))

        # Closing brace.
        if used < B and balance > 0:
            choices.append(('}', (i, balance - 1, used + 1, True)))

        choices.sort(key=lambda x: x[0])

        for ch, state in choices:
            ni, nb, nu, nh = state
            ways = count(ni, nb, nu, nh)

            if ways < k:
                k -= ways
            else:
                ans.append(ch)
                i, balance, used, has = state
                break

    print(''.join(ans))

if __name__ == "__main__":
    solve()
```第一个循环计算必须包含大括号的间隙的确切数量。 从这个值来看，`B`是通过四舍五入到偶数获得的。 特殊情况`B = 0`不需要单独处理，因为同一个 DP 自然只允许原始字符串。 

这`count`函数是中心动态程序。 这`i == n`case 在转换逻辑之前处理，因为没有剩余的原始字符可以发出，但大括号可能仍然需要放置在最后的间隙中。 只有当所有的`B`已使用大括号且余额为零。 

这`required_gap`表达式精确检查之间的差距`s[i - 1]`和`s[i]`。 这就是该条件使用的原因`i > 0`和`i < n`隐式地通过周围的分支。 这`has`仅在发出原始字符后才会重置标志，因此在该字符之前插入的大括号都属于同一间隙。 

词典编排刻意考虑了原始人物，`{`， 和`}`分别并按其实际字符值对它们进行排序。 自从`+ < - < { < }`，Python 的正常字符串排序已经给出了所需的顺序。 

Python 中不存在整数溢出问题，但显式上限为`10^18`保持 DP 中不同整数值的数量有界，并反映取消排序过程所需的唯一精度。 每次添加后都会应用上限，而不是在评估整个 DP 后。 

## 工作示例

 对于第一个官方样品，`s = "++--"`和`k = 2`。 存在 1 个不良间隙，因此支架的最小数量为 2 个。 最优字符串排序为`++-{-}`,`++-{}-`,`++{-}-`,`+{+-}-`， 和`{++-}-`。 因此第二个就是答案。 原始声明中给出了示例和此顺序。 

|`i`|`balance`|`used`|`has`| 选择的前缀 |
 | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | 假 |`+`|
 | 1 | 0 | 0 | 假 |`++`|
 | 2 | 0 | 0 | 假 |`++-`|
 | 3 | 0 | 0 | 假 |`++-`|
 | 3 | 1 | 1 | 真实 |`++-{`|
 | 4 | 0 | 2 | 假 |`++-{}`|
 | 4 | 0 | 2 | 假 |`++-{}-`|

 在前两个位置，唯一以这些原始加号开头的最佳字符串形成了字典顺序最早的块。 在第一个连字符处，第一个候选也是强制的。 在所需间隙内，选择`}`立即是不可能的，因为余额为零，所以`{`被选中。 插入左大括号后，下一个原始连字符按字典顺序小于`}`，因此算法在关闭该对之前发出它。 这会产生`++-{}-`。 

对于第二个官方样本，`s = "-+-+"`。 没有连续的连字符，所以`B = 0`。 唯一的最佳转义字符串是原始字符串本身。 自从`k = 2`，初始 DP 计数为 1，算法立即打印`Overflow`。 

|`i`|`balance`|`used`|`has`| 选择的前缀 |
 | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | 假 |`-`|
 | 1 | 0 | 0 | 假 |`-+`|
 | 2 | 0 | 0 | 假 |`-+-`|
 | 3 | 0 | 0 | 假 |`-+-+`|

 因为当零个大括号就足够时，最佳字符串中不允许有大括号，所以只有一个完成。 请求的第二次完成不存在。 

## 复杂度分析

 让`n <= 60`是原始字符串长度并且`B <= 60`是括号的最小数量。 

| 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n B²)`| 有`O(n B²)`相关状态，并且每个状态都有恒定大小的转换。 |
 | 空间|`O(n B²)`| 记忆表存储每个状态的一个上限计数。 |

 附加布尔值`has`仅将状态计数乘以二，因此不会改变渐近复杂度。 和`n`和`B`两者都最多 60 个，状态数量大大低于 100 万，这符合问题的 1 秒和 512 MB 限制。 

## 测试用例```python
import sys
import io
from functools import lru_cache

LIMIT = 10**18

def solve_string(inp: str) -> str:
    data = inp.strip().split()
    s = data[0]
    k = int(data[1])
    n = len(s)

    required = sum(
        1 for i in range(1, n)
        if s[i - 1] == '-' and s[i] == '-'
    )

    B = required if required % 2 == 0 else required + 1

    @lru_cache(None)
    def count(i, balance, used, has):
        if used > B or balance > B:
            return 0

        if i == n:
            return int(used == B and balance == 0)

        ans = 0

        if used < B:
            ans = min(
                LIMIT,
                ans + count(i, balance + 1, used + 1, True)
            )

            if balance > 0:
                ans = min(
                    LIMIT,
                    ans + count(i, balance - 1, used + 1, True)
                )

        required_gap = (
            i > 0 and
            s[i - 1] == '-' and
            s[i] == '-'
        )

        if not required_gap or has:
            ans = min(
                LIMIT,
                ans + count(i + 1, balance, used, False)
            )

        return ans

    if count(0, 0, 0, False) < k:
        return "Overflow"

    ans = []
    i = balance = used = 0
    has = False

    while not (i == n and used == B and balance == 0):
        choices = []

        if i < n:
            required_gap = (
                i > 0 and
                s[i - 1] == '-' and
                s[i] == '-'
            )

            if not required_gap or has:
                choices.append(
                    (s[i], (i + 1, balance, used, False))
                )

        if used < B:
            choices.append(
                ('{', (i, balance + 1, used + 1, True))
            )

            if balance > 0:
                choices.append(
                    ('}', (i, balance - 1, used + 1, True))
                )

        choices.sort()

        for ch, state in choices:
            ways = count(*state)
            if ways < k:
                k -= ways
            else:
                ans.append(ch)
                i, balance, used, has = state
                break

    return ''.join(ans)

# Provided sample 1
assert solve_string("++--\n2\n") == "++-{}-", "sample 1"

# Provided sample 2
assert solve_string("-+-+\n2\n") == "Overflow", "sample 2"

# Minimum-size input
assert solve_string("+\n1\n") == "+", "minimum-size input"

# Boundary case: all optimal strings for "--" are
# -{-}, -{}-, {-}-
assert solve_string("--\n1\n") == "-{-}", "first lexicographic answer"
assert solve_string("--\n2\n") == "-{}-", "second lexicographic answer"
assert solve_string("--\n3\n") == "{-}-", "last lexicographic answer"
assert solve_string("--\n4\n") == "Overflow", "past last answer"

# Maximum-size input, all characters equal
assert solve_string("+" * 60 + "\n1\n") == "+" * 60, "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`+\n1`|`+`| 最小长度和零所需的大括号 |
 |`--\n1`|`-{-}`| 所需的间隙和词典选择|
 |`--\n3`|`{-}-`| 大括号可能出现在所需间隙之外 |
 |`--\n4`|`Overflow`| 解数的精确边界 |
 | 60 优点`k = 1`| 60 优点 | 最大输入长度和全等字符 |

 ## 边缘情况

 对于`s = "--"`和`k = 1`，需要一个间隙，因此最小大括号数为两个。 字典顺序最小解的第一个字符是`-`， 因为`- < {`。 在该连字符之后，所需的间隙必须包含大括号。 选择`{`是可能的，并将原始的第二个连字符保留为下一个字符，因为`- < }`。 其余`}`放置在第二个连字符之后，给出`-{-}`。 该算法准确地达到该状态序列并返回第一个解决方案。 

为了`s = "--"`和`k = 3`, 前两位候选人`-{-}`和`-{}-`在取消排名期间被跳过。 剩下的候选人开始于`{`，按字典顺序大于`-`，并且是`{-}-`。 这种情况错误地假设每个大括号必须直接放在两个连字符之间。 

为了`s = "-+-+"`，没有必要的间隙。 最小大括号计数为零，因此插入任何大括号都会导致结果非最佳。 因此 DP 仅有一个终结完成，即`-+-+`。 和`k = 2`，初始计数小于`k`，所以算法正确打印`Overflow`。 

对于完全由加号组成的最大长度字符串（例如 60 个加号），不需要间隙，并且最佳大括号计数为零。 DP 本质上包含一条通过原始字符的路径，并按原样返回输入。 这练习了长度上限，而不会引入不必要的组合复杂性。 

对于完全由连字符组成的字符串，每个内部间隙都是必需的。 如果有 60 个连字符，则需要 59 个间隙，因此最佳的大括号数量是 60，而不是 59。额外的大括号是由于大括号总数为偶数的要求而强制的。 这是最直接考验计算的边界`B`，并且DP在没有特殊情况的情况下处理它，因为它独立地处理所需间隙条件和全局平衡条件。
