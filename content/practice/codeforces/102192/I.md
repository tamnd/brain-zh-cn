---
title: "CF 102192I - 让ZYB快乐"
description: "我们有 (n) 个头衔。 头衔（ti）具有幸福值（hi）。 对于任何字符串 (x)，查看 (x) 至少出现一次的每个标题。 ZYB 从说 (x) 中得到的快乐是相应的 (hi) 的乘积。"
date: "2026-08-18T02:09:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102192
codeforces_index: "I"
codeforces_contest_name: "2018 Chinese Multi-University Training, Nanjing U Contest"
rating: 0
weight: 102192
solve_time_s: 267
verified: true
draft: false
---

[CF 102192I - 让 ZYB 开心](https://codeforces.com/problemset/problem/102192/I)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (n) 个头衔。 标题 (t_i) 具有幸福值 (h_i)。 对于任何字符串 (x)，查看 (x) 至少出现一次的每个标题。 ZYB 从 (x) 中获得的幸福感是对应的 (h_i) 的乘积。 在同一标题内多次出现不会再次使值相乘。 

对于查询 (m)，以相等的概率选择长度至多为 (m) 的每个非空小写字符串。 如果一个字符串不是任何标题的子字符串，那么它的幸福度为零。 我们需要预期幸福指数 (10^9+7)。 

输入最多包含 (10^4) 个标题，而它们的总长度最多为 (3\cdot10^5)。 这个总长度对于字符串数据结构来说是重要的参数，因为后缀自动机在总输入长度中具有线性大小。 查询计数也可以达到(3\cdot10^5)，因此通过扫描所有长度来回答每个查询的成本太高。 查询长度可以达到（10^6），这意味着概率分布的分母必须独立于标题长度进行处理。 

对于固定值 (m)，可能的字符串数量为

 [
 D_m=26^1+26^2+\cdots+26^m。 
]

 分子是所有长度最多为 (m) 的不同字符串的幸福值之和。 直接枚举是不可能的。 在删除重复项之前，即使一个长度为 (300000) 的标题也有 (300000\cdot300001/2=45000150000) 次子字符串出现。 

有几个地方很容易犯无声的错误。 首先，在同一个标​​题中重复出现的幸福感不得增加一次以上。 例如，```
1
aaa
2
1
1
```唯一有用的长度为 1 的字符串是`a`，它的幸福度是 (2)，而不是 (2^3)，所以答案是 (2/26=1/13)，即 (153846155) 对给定素数取模。 基于事件的实现会错误地处理三个副本`a`作为三个独立的贡献。 

其次，同一字符串出现在多个标题中必须将它们的值相乘。 例如，```
2
a
a
2 3
1
1
```字符串`a`两个标题中都出现了，所以它的幸福度是 (2\cdot3=6)。 正确答案是（6/26=461538465）。 如果实现只存储每个不同的字符串一次而没有其标题集，则可能会错误地使用 (2+3) 或两个值之一。 

第三，查询可能比每个标题都长。 考虑```
1
a
1
1
2
```对于(m=2)，仅`a`对分子有贡献，所以分子仍然是(1)，但分母是(26+26^2=702)。 答案是(702^{-1}=206552708)。 分母不得以最长标题为上限。 

官方存档包含原始问题和示例数据。 

## 方法

 蛮力的想法在概念上很简单。 枚举每个长度最大（m）的候选字符串，在每个标题中搜索它，确定哪些标题包含它，将它们的幸福值相乘，并将结果相加。 这是正确的，因为它直接遵循期望值的定义。 不幸的是，候选人的人数是

 [
 26+26^2+\cdots+26^m=\Theta(26^m)。 
]

 对于 (m=10^6)，这超出了任何有意义的计算。 即使我们避免枚举从未出现过的候选项，而是枚举标题的所有子字符串，长度为 (300000) 的单个标题也有 (45000150000) 次子字符串出现。 

蛮力之所以有效，是因为每个单独的字符串都可以独立评估，但它会失败，因为几乎所有的工作都是在高度重叠的子字符串之间重复进行的。 关键的观察是后缀自动机将具有相同结束位置集的子串分组。 特别是，由一个后缀自动机状态表示的所有字符串都具有完全相同的出现集，因此它们也出现在完全相同的标题集合中。 因此他们的幸福值是相同的。 

这使得广义后缀自动机成为自然压缩。 我们构建一个包含所有标题的自动机，在插入每个新标题之前将当前状态重置为根。 对于每个标题，我们都会在自动机中遍历它。 在每个达到的状态，其后缀链接祖先代表当前前缀的后缀，因此所有这些状态都对应于该标题中出现的子字符串。 我们将州的值乘以标题的 (h_i)，但每个标题仅乘以一次。 

之后，一个后缀自动机状态仍然代表几种不同的子串长度。 如果状态 (v) 有长度`len[v]`和后缀链接 (fa[v])，则它准确地表示每个长度的一个不同子字符串

 [
 [\text{len}[fa[v]]+1,\text{len}[v]]。 
]

 所有这些子字符串都具有相同的出现集，因此具有相同的幸福值。 我们可以使用差异数组将该值添加到区间。 然后，两个前缀和将这些状态间隔转化为每个精确长度的总幸福度，最后转化为每个长度（m）的总幸福度。 

这里使用的广义后缀自动机结构是独立于根插入多个字符串的标准结构。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (\Theta(26^m)) 或 (\Theta(L^2)) 只是为了枚举子字符串的出现次数 | 潜在 (\Theta(26^m)) | 太慢了|
 | 广义 SAM | (O(L+M+Q)) 摊销，其中 (L) 是总标题长度，(M) 是最大查询 | (O(L+M+Q)) | 已接受 |

 ## 算法演练

 1. 首先阅读所有标题，并令 (L) 为它们的总长度。 普通扩展构建的后缀自动机最多有(2L+1)个状态，因此我们可以在构建它之前预留足够的存储空间。 
2. 构建广义后缀自动机。 在插入每个标题之前，设置`last`到根。 当当前状态已存在转换时，如果其长度恰好比当前状态的长度大 1，则重用它。 否则创建一个克隆，与普通后缀自动机构造完全相同。 

对现有过渡的特殊处理使得多个独立标题可以共享同一个自动机，而无需插入人工分隔符。 
3.将各状态的幸福值初始化为(1)。 对于每个标题 (t_i)，从根开始遍历标题。 到达当前前缀对应的状态后，按照后缀链接向上。 每个访问的状态代表 (t_i) 中出现的子串，因此将其存储值乘以 (h_i)。 

对于一个标题，状态只需更新一次。 将当前标题的索引存储在`seen[state]`。 当向上行走到达已经标有该标题索引的状态时，停止。 它的所有后缀链接祖先都已在早期步行过程中被标记。 
4. 处理完每个标题后，状态 (v) 的值等于 (h_i) 与包含 (v) 表示的子字符串的那些标题的乘积。 

这是有效的，因为后缀自动机状态是具有相同结束位置集的字符串的等价类。 相同的结束位置集意味着相同的标题成员资格集，即使标题之间的实际出现位置可能不同。 
5. 对于每个非根状态 (v)，添加`value[v]`到长度间隔

 [
 [\text{len}[fa[v]]+1,\text{len}[v]]。 
]

 用差异数组存储它：

 [
 diff[\text{len}[fa[v]]+1] += 值[v],
 ]

 [
 diff[\text{len}[v]+1] -= 值[v]。 
]

 这里不需要遍历后缀链接树。 每个状态都已经知道它的后缀链接及其长度，因此可以直接处理所有区间。 
6. 取差值数组的一个前缀和。 经过这一关后，`by_len[k]`是长度恰好为 (k) 的所有不同字符串的幸福值之和。 
7. 取第二个前缀和。 现在`prefix[k]`是长度在 (1) 和 (k) 之间的每个不同字符串的总幸福度。 不是任何标题子字符串的字符串自动贡献零。 
8. 对于每个查询 (m)，期望的期望是

 [
 \frac{\text{前缀}[m]}
 {26^1+26^2+\cdots+26^m}
 \pmod {10^9+7}。 
]

 一旦（m）超过最长标题，分子就变为常数，但分母不断增加。 这就是为什么大于最长标题的查询仍必须使用其原始标题 (m) 的原因。 
9. 由于可能有 (3\cdot10^5) 个查询，因此为每个分母单独计算模逆会增加 (O(Q\log MOD)) 工作。 相反，对不同的查询值进行排序，计算它们的分母，同时前进一次长度，并使用批量反转。 所有分母的乘积都会反转一次，然后在线性时间内恢复每个单独的倒数。 

### 为什么它有效

 考虑任何广义后缀自动机状态 (v)。 它所表示的字符串都具有相同的结束位置集，因此它们出现在完全相同的标题中。 因此，在处理每个标题时执行的乘法精确地给出了由 (v) 表示的每个字符串的幸福值。 后缀链接结构将所有不同的子字符串划分为不相交的长度区间 ((\text{len}[fa[v]],\text{len}[v]])，该区间中的每个长度都有一个不同的子字符串。因此，将状态值添加到此区间将每个不同出现的字符串精确计数一次。两个前缀和将这些每个长度的贡献转换为每个查询的分子，而分母则对每个可能的随机字符串进行计数，包括不出现的字符串。因此 最后的分数正是所需的期望。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from array import array

MOD = 1000000007
ALPHA = 26

def solve():
    n = int(input())
    titles = [input().strip().encode() for _ in range(n)]
    total_len = sum(len(s) for s in titles)
    max_title_len = max(len(s) for s in titles)

    happiness = list(map(int, input().split()))

    q = int(input())
    queries = [int(input()) for _ in range(q)]
    max_query = max(queries)

    # A SAM built from L characters has at most 2L+1 states.
    max_states = 2 * total_len + 5

    # Compact 32-bit arrays are necessary in Python.
    # transitions[state * 26 + c] stores the destination.
    trans = array('i', [0]) * (max_states * ALPHA)
    link = array('i', [0]) * max_states
    length = array('i', [0]) * max_states
    seen = array('i', [0]) * max_states
    value = array('i', [1]) * max_states

    # Root is state 1.
    size = 1

    for s in titles:
        last = 1

        for ch in s:
            c = ch - 97
            p = last
            edge = trans[p * ALPHA + c]

            if edge:
                # The transition already exists.
                qstate = edge

                if length[qstate] == length[p] + 1:
                    last = qstate
                    continue

                # The existing transition is too long, so clone it.
                clone = size + 1
                size = clone

                length[clone] = length[p] + 1
                link[clone] = link[qstate]

                src = qstate * ALPHA
                dst = clone * ALPHA
                trans[dst:dst + ALPHA] = trans[src:src + ALPHA]

                while p and trans[p * ALPHA + c] == qstate:
                    trans[p * ALPHA + c] = clone
                    p = link[p]

                link[qstate] = clone
                last = clone
                continue

            # Create the usual new state.
            new_state = size + 1
            size = new_state
            length[new_state] = length[p] + 1
            last = new_state

            while p and trans[p * ALPHA + c] == 0:
                trans[p * ALPHA + c] = new_state
                p = link[p]

            if p == 0:
                link[new_state] = 1
                continue

            qstate = trans[p * ALPHA + c]

            if length[qstate] == length[p] + 1:
                link[new_state] = qstate
                continue

            # Split qstate with a clone.
            clone = size + 1
            size = clone

            length[clone] = length[p] + 1
            link[clone] = link[qstate]

            src = qstate * ALPHA
            dst = clone * ALPHA
            trans[dst:dst + ALPHA] = trans[src:src + ALPHA]

            link[qstate] = clone
            link[new_state] = clone

            while p and trans[p * ALPHA + c] == qstate:
                trans[p * ALPHA + c] = clone
                p = link[p]

    # For each title, mark every SAM state whose represented strings occur
    # in that title, and multiply its happiness exactly once.
    for tag, (s, h) in enumerate(zip(titles, happiness), 1):
        cur = 1

        for ch in s:
            cur = trans[cur * ALPHA + ch - 97]

            v = cur
            while v and seen[v] != tag:
                seen[v] = tag
                value[v] = value[v] * h % MOD
                v = link[v]

    # Difference array over substring lengths.
    diff = array('i', [0]) * (max_title_len + 2)

    for v in range(2, size + 1):
        left = length[link[v]] + 1
        right = length[v]

        diff[left] += value[v]
        if diff[left] >= MOD:
            diff[left] -= MOD

        diff[right + 1] -= value[v]
        if diff[right + 1] < 0:
            diff[right + 1] += MOD

    # First prefix sum gives the contribution of each exact length.
    # Second prefix sum gives the contribution of all lengths <= m.
    current = 0
    cumulative = 0

    for i in range(1, max_title_len + 1):
        current += diff[i]
        if current >= MOD:
            current -= MOD

        cumulative += current
        if cumulative >= MOD:
            cumulative -= MOD

        diff[i] = cumulative

    # Compute denominators for the distinct queried lengths.
    unique_queries = sorted(set(queries))
    denominators = []

    power = 1
    denominator = 0
    position = 0

    for m in unique_queries:
        while position < m:
            power = power * 26 % MOD
            denominator += power
            if denominator >= MOD:
                denominator -= MOD
            position += 1

        denominators.append(denominator)

    # Batch inversion of all distinct denominators.
    k = len(denominators)
    prefix_product = [1] * k
    product = 1

    for i, d in enumerate(denominators):
        prefix_product[i] = product
        product = product * d % MOD

    inverse_product = pow(product, MOD - 2, MOD)
    inverses = [0] * k

    for i in range(k - 1, -1, -1):
        inverses[i] = inverse_product * prefix_product[i] % MOD
        inverse_product = inverse_product * denominators[i] % MOD

    inverse_by_query = {
        m: inv for m, inv in zip(unique_queries, inverses)
    }

    output = []

    for m in queries:
        if m <= max_title_len:
            numerator = diff[m]
        else:
            numerator = diff[max_title_len]

        answer = numerator * inverse_by_query[m] % MOD
        output.append(str(answer))

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```实现的第一部分在分配自动机之前读取所有标题。 这预先给出了总长度，因此转换表可以存储在一个紧凑的文件中`array('i')`有 (26(2L+5)) 个条目。 Python 的列表列表会使用更多的内存，因为每个整数和每个列表都会带来 Python 对象开销。 

插入代码是普通后缀自动机扩展的通用版本。 当前状态将重置为每个标题的根。 当现有的转换恰好具有所需的长度时，它可以直接表示新的前缀。 如果它比需要的长，则需要克隆来分离等价类。 克隆接收传出转换的副本并继承旧的后缀链接。 

这`seen`数组按标题编号进行索引。 这比清除每个标题的布尔数组要便宜。 在一个标题的遍历过程中，达到一个状态`seen`值已经等于当前标题意味着该状态及其上方的所有后缀链接祖先都已被处理。 

在构造差异数组时故意跳过根。 它代表空字符串，而问题中的随机字符串必须非空。 间隔开始于`length[link[v]] + 1`，端点是`length[v]`，所以右边界是包含在内的。 减法被放置在`right + 1`，这是标准的差分数组约定。 

所有幸福乘积立即按模 (10^9+7) 减少。 Python 整数不会溢出，但延迟模数缩减会使值不必要地变大并减慢乘法速度。 

并不是每个长度都存储分母。 对查询进行排序，并且 (26) 的运行能力仅在必要时提高。 这使用 (O(M)) 时间，其中 (M) 是最大的查询。 然后，批量求逆将所有分母求逆简化为一次模幂加线性功。 

分子数组只需要扩展到最长的标题。 超过该点就没有新出现的字符串，因此分子保持不变。 然而，对于每个更大的查询，分母都会继续增长。 

## 工作示例

 官方的样本是```
2
zybnb
ybyb
3 5
4
1
2
3
4
```对于第一个标题，幸福值为 (3)，对于第二个标题，幸福值为 (5)。 按长度分组的不同出现的字符串具有以下总幸福度。 

| 长度| 出现不同的字符串 | 贡献这个长度| 累积分子|
 | --- | --- | --- | --- |
 | 1 |`z`,`y`,`b`,`n`| (3+15+15+3=36) | 36 | 36
 | 2 |`zy`,`yb`,`bn`,`nb`,`by`| (3+15+3+3+5=29) | 65 | 65
 | 3 |`zyb`,`ybn`,`bnb`,`yby`,`byb`| (3+3+3+5+5=19) | 84 | 84
 | 4 |`zybn`,`ybnb`,`ybyb`| (3+3+5=11) | 95 | 95

 对于 (m=1)，分母为 (26)，因此期望为 (36/26=18/13)，给出`769230776`。 对于 (m=2)，分母为 (26+676=702)，分子为 (65)，得出`425925929`。 其余两个查询使用分子 (84) 和 (95)，产生官方输出`891125950`和`633120399`。 

州级 SAM 计算被压缩为这些长度贡献。 例如，间隔为长度 (2) 到 (4) 的状态将其单一幸福值贡献给所有这三个长度，这正是差值数组所表示的。 

再举一个例子，取一个标题：```
1
ab
2
3
1
2
3
```有用的字符串是`a`,`b`， 和`ab`，各有幸福（2）。 按长度处理为：

 | 长度| 后缀链接间隔后的状态贡献 | 精确总长度 | 累积分子| 分母|
 | --- | --- | --- | --- | --- |
 | 1 |`a`,`b`每人贡献 2 | 4 | 4 | 26 | 26
 | 2 |`ab`贡献 2 | 2 | 6 | 702 | 702
 | 3 | 没有出现的字符串 | 0 | 6 | 18278 |

 因此，答案为 (4/26=307692310)、(6/702=239316241) 和 (6/18278) 模 (10^9+7)。 

这个例子练习了状态区间的边界。 子串`ab`必须精确贡献长度 (2)，而其后缀`a`和`b`通过其他州代表。 它还表明，一旦查询超过最大标题长度，分子就会停止变化，但分母不会。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(L+M+Q)) 摊销 | SAM 构造和标题标记在总标题大小中是线性的，长度聚合是线性的，分母取 (O(M))，批量反转加输出取 (O(Q)) |
 | 空间| (O(L+M+Q)) | SAM 具有 (O(L)) 状态和转换，长度差数组具有 (O(L)) 条目，查询加上批量反转数组使用 (O(Q)) 空间 |

 这里是 (L\le3\cdot10^5)、(M\le10^6) 和 (Q\le3\cdot10^5)。 紧凑整数数组在 Python 中特别有用，因为转换表包含大约 (26\cdot2L) 个四字节整数，而不是数百万个 Python 对象。 生成的内存占用量完全低于规定的 256 MB 限制，而算法则避免了每个操作，具体取决于查询长度。 

## 测试用例

 以下线束假设`solve()`从上面的解决方案中可以得到函数。 帮手`fraction_mod`直接计算小的期望值，而最终情况检查允许的最大查询长度而不枚举任何字符串。```python
import sys
import io

MOD = 1000000007

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = input

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    input = sys.stdin.readline

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = old_input

def fraction_mod(numerator, m):
    denominator = 26 * (pow(26, m, MOD) - 1) % MOD
    denominator = denominator * pow(25, MOD - 2, MOD) % MOD
    return numerator * pow(denominator, MOD - 2, MOD) % MOD

# Provided sample
sample = """\
2
zybnb
ybyb
3 5
4
1
2
3
4
"""

assert run(sample) == (
    "769230776\n"
    "425925929\n"
    "891125950\n"
    "633120399\n"
), "sample"

# Minimum-size input
case_min = """\
1
a
1
1
1
"""

assert run(case_min) == "576923081\n", "minimum case"

# Same string in three titles, all happiness values equal.
# The string a must contribute 2*2*2 = 8, not 2.
case_equal = """\
3
a
a
a
2 2 2
2
1
2
"""

assert run(case_equal) == (
    str(fraction_mod(8, 1)) + "\n" +
    str(fraction_mod(8, 2)) + "\n"
), "equal values and repeated titles"

# Boundary between exact substring lengths.
# a and b have contribution 2 each, while ab contributes 2.
case_boundary = """\
1
ab
2
3
1
2
3
"""

assert run(case_boundary) == (
    str(fraction_mod(4, 1)) + "\n" +
    str(fraction_mod(6, 2)) + "\n" +
    str(fraction_mod(6, 3)) + "\n"
), "substring-length boundary"

# Maximum permitted query length.
# The numerator is always 1, but the denominator contains 10^6 length levels.
case_max_query = """\
1
a
1
1
1000000
"""

expected_max = fraction_mod(1, 1000000)
assert run(case_max_query) == str(expected_max) + "\n", "maximum query length"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 所提供的`zybnb`,`ybyb`样品|`769230776`,`425925929`,`891125950`,`633120399`| 完整的参考案例和重叠子串 |
 | 一个标题`a`, 幸福 1, 查询 1 |`576923081`| 最小大小输入和根/非空字符串边界 |
 | 三个相同的标题`a`，一切幸福2|`307692310`,`652421657`| 头衔之间的乘法和平等的幸福值|
 | 一个标题`ab`, 幸福 2, 疑问 1, 2, 3 |`307692310`,`239316241`,`6/18278 mod MOD`| 标题之外的精确区间端点和查询 |
 | 一个标题`a`，幸福1，查询(10^6)|`S_1000000^{-1} mod MOD`| 最大查询长度和分母不断增长的事实 |

 ## 边缘情况

 单个标题内重复出现的内容由`seen`大批。 为了```
1
aaa
2
1
```标题是从左到右处理的，后缀链接行走可能会遇到代表的状态`a`几次。 第一次遭遇将其值乘以 (2)，而后续遭遇则看到`seen[state] == 1`并在那一点停止。 因此`a`,`aa`， 和`aaa`每个人都会获得幸福 (2)，而不是每次出现时乘以 (2) 一次。 

标题成员资格和出现次数之间的区别也得到了正确处理```
2
a
a
2 3
1
1
```第一个标题标志着该州`a`并将其值从 (1) 更改为 (2)。 第二个标题具有不同的标签，因此它再次标记相同的状态并将其值从 (2) 更改为 (6)。 长度一的分子为 (6)，答案为 (6/26=461538465)。 次数`a`任何一个标题中出现的内容都不会进入计算。 

后缀链接间隔边界是通过在以下位置添加状态值来处理的：`len[fa[v]] + 1`并将其删除于`len[v] + 1`。 为了```
1
ab
2
1
2
```与单字符子串对应的状态贡献长度为一，而代表`ab`贡献长度为二。 所得分子为 (4) 和 (6)。 如果减法放在`len[v]`而不是`len[v] + 1`，长度二的贡献将会消失。 

比每个标题都长的查询会运用不同的边界。 为了```
1
a
1
1
2
```唯一的正幸福字符串是`a`，因此两个查询的分子仍为 (1)。 然而，对于 (m=2)，有 (26+676=702) 个可能的字符串，给出 (1/702=206552708)。 该实现将分子保持为其最后的计算值，同时继续将分母扩展到每个查询的长度。 

最后，根状态永远不会添加到差异数组中。 其表示的字符串是空字符串，而随机选择至少包含一个字符。 包含根会添加一个虚构的长度为零的贡献并改变每个答案。
