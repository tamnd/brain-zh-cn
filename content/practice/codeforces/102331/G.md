---
title: "CF 102331G - 语法"
description: "该图对于输入字符串 s 的每个不同的非空子字符串都有一个顶点。 从长度为 L 的子串 t 开始，一条边通向长度为 L-1 的 t 中的每个不同子串。"
date: "2026-08-14T04:56:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102331
codeforces_index: "G"
codeforces_contest_name: "2019 Summer Petrozavodsk Camp, Day 2: 300iq Contest 2 (XX Open Cup, Grand Prix of Kazan)"
rating: 0
weight: 102331
solve_time_s: 171
verified: true
draft: false
---

[CF 102331G - 语法](https://codeforces.com/problemset/problem/102331/G)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该图对于输入字符串的每个不同的非空子字符串都有一个顶点`s`。 从子串`t`长度`L`，一条边指向每个不同的子串`t`长度`L-1`。 

长度只有两个可能的子串`L-1`里面`t`：删除其第一个字符，或删除其最后一个字符。 通常这两个字符串是不同的，因此一个顶点有两个出边。 当每个字符都相等时，它们完全相等`t`是一样的。 在这种情况下，两个可能的边会合二为一。 

一条路径起始于`s`重复从任一端删除一个字符。 它的长度严格减少，因此每条路径自动都是简单的。 任务是统计所有这样的路径，包括仅由`s`, 取模`998244353`。 

长度限制为`300000`，因此字符串长度的任何二次方都超出范围。 可以有 θ(n²) 个不同的子串，当`n = 300000`。 解决方案必须避免枚举子串或图顶点。 2 秒的限制使得 O(n log n) 解决方案不受欢迎，除非常数因子很小，而 O(n) 解决方案是自然目标。 

微妙之处在于，同一子串的两次不同出现代表一个图顶点。 例如，在`aabaa`, 子串`aa`出现两次，但通过不同的前面字符串到达​​它的路径仍然是不同的路径。 我们必须计算路径，而不是独立计算图顶点的出现次数。 

另一种边缘情况是由一个重复字符组成的子字符串。 为了`aa`，两种删除端点的方法都会产生相同的顶点`a`，因此只有一个出边。 输入正确答案`aa`是`2`，对应于`aa`和`aa -> a`。 将两个端点删除视为不同的将给出`3`。 

对于较长的一元字符串，同样的现象变得更加明显。 用于输入`aaa`，该图很简单`aaa -> aa -> a`，所以答案是`3`， 不是`7`。 假设每个顶点都有两个出边的粗心解决方案将使用`2^n-1`计数并失败。 

在另一个极端，考虑`ab`。 它的两个长度为一的孩子是`a`和`b`，所以路径是`ab`,`ab -> a`， 和`ab -> b`。 正确答案是`3`。 这是两个端点转换确实不同的最小情况。 

## 方法

 直接动态程序会分配一个值`dp(t)`对于每个不同的子串`t`。 如果`t`不是一元的，它的两个子元素是长度的前缀和后缀`|t|-1`, 给予`dp(t) = 1 + dp(prefix) + dp(suffix)`。 

对于一元字符串，两个孩子重合，所以`dp(t) = 1 + dp(prefix)`。 

这种递归是完全正确的，因为每条路径要么立即停止，要么恰好采用一个传出边缘，然后继续从该子路径开始的路径。 

问题在于州的数量。 一个长度的字符串`n`可以有 θ(n²) 个不同的子串，甚至每个子串存储一个状态也是不可能的`n = 300000`。 在最坏的情况下，这意味着数百亿个状态和转换，远远超出时间和内存限制。 

有用的观察是该图几乎是一个二元图。 子字符串有两个不同的传出转换，除非其所有字符都相等。 官方教程正是利用了这种区别：一旦当前子字符串变成一元，它的延续就会被强制。 

想象一下沿着一条路径并查看当前子字符串变为一元的第一个时刻。 在那一刻之前，每个删除选择都是真正的二元选择。 一旦它变成一元，每个长度只有一个可能的下一个顶点，所以如果一元子串有长度`k`，正好有`k`从它继续的可能路径，每个可能的停止点都有一条。 

这让我们避免了巨大的子串图。 最终顶点为非一元的路径可以直接通过它们在原始字符串中的间隔来计数。 曾经变成一元的路径可以通过它们的第一个一元间隔来分类。 只有最大等字符游程的前缀和后缀可以是第一个一元区间，因此这种情况只有 O(n)。 

对于一个发生间隔`[l, r]`，从`s`意味着删除`l`从左边开始的字符和`n-1-r`从右边开始的字符。 这些删除的顺序可以任意选择，给出`C(l + n - 1 - r, l)`到达该间隔的不同路径。 

如果`[l,r]`包含至少两个不同的字符，它是从未变成一元路径的有效端点。 我们可以对这些值求和，而无需使用曲棍球棒恒等式枚举所有间隔。 

暴力破解之所以有效，是因为递归只有两个子字符串，但当存在 θ(n²) 子串时，暴力破解就会失败。 观察到只有一元子串会折叠两个转换，我们可以通过 O(n) 基于运行的贡献来计算整个图。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) 状态和转换 | O(n²) | 太慢了|
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 预先计算阶乘和逆阶乘`n`，因此每个所需的二项式系数都可以用 O(1) 模来计算`998244353`。 由于所有上层参数最多是`n-1`，这就足够了。 
2. 分裂`s`分成相同字符的最大运行次数。 跑步时`[L,R]`，仅由该字符组成的每个子字符串都位于此运行中。 
3. 计算最终子串至少包含两个不同字符的路径。 修复左端点`l`，并让`x`是以下时间或之后的第一个位置`l`谁的性格不同`s[l]`。 然后是一个区间`[l,r]`恰好是非一元的`r >= x`。 

本次固定缴款额`l`是`sum C(l+n-1-r, l)`为了`r = x ... n-1`。 

放`a = l+n-1-r`。 范围变为`a = l ... l+n-1-x`，所以曲棍球棒恒等式给出`sum C(a,l) = C(l+n-x, l+1)`。 

因此，在 O(1) 内获得了一项贡献，并且所有`l`可以在 O(n) 内处理。 
4. 对于每次最大运行`[L,R]`，计算第一个一元子字符串是本次运行的前缀的路径。 这样的前缀是`[L,r]`。 通过删除紧邻之前的字符，它可以首先变成一元`L`， 假如`L > 0`。 该前任是非一元的，因为`[L,R]`是最大运行。 

前身是`[L-1,r]`，所以到达它的路径数是`C(L+n-r-2, L-1)`。 

到达长度的一元子串后`r-L+1`，正好有`r-L+1`可能的停止方法。 将两个数量相乘并将结果相加。 
5. 对称地计算一元后缀`[l,R]`。 这样的后缀可以通过删除紧接其后的字符来首先变成一元后缀`R`， 假如`R < n-1`。 

前身是`[l,R+1]`, 给予`C(l+n-R-2, l)`通往前任的路径。 一元后缀有长度`R-l+1`，所以它的贡献是`C(l+n-R-2, l) * (R-l+1)`。 
6. 当游程两侧都存在时，整个游程可以出现在前缀和后缀计算中。 这是正确的，因为这两种情况对应于不同的先前顶点，因此对应于不同的路径。 
7. 如果整个输入字符串是一次运行，`s`本身已经是一元的。 没有非一元前驱，因此前一个计数产生零。 在这种特殊情况下，该图是一个链`n`顶点，答案很简单`n`。 
8. 将非一元端点和所有第一一元案例的贡献相加`998244353`。 

### 为什么它有效

 考虑从以下位置开始的任何路径`s`。 如果它从未到达一元子串，则其最终顶点是非一元区间`[l,r]`。 左右删除的顺序唯一决定了那个区间，并且正好有`C(l+n-1-r,l)`此类删除命令。 因此，第一部分对这种类型的每条路径只计数一次。 

现在考虑第一次到达一元子串的路径`[l,r]`。 自从`[l,r]`位于最大等字符游程内，前一个顶点必须将间隔延伸到该游程的边界。 最后`[l,r]`必须是最大游程的前缀或后缀。 这些公式精确计算到达非一元前驱的路径，然后将转换引入`[l,r]`。 Once there, every next transition is forced, so a unary substring of length`k`准确贡献`k`可能的路径结局。 These two classes are disjoint and cover every path, which proves that the final sum is exactly the required answer.

 ## Python 解决方案```python
import sys

input = sys.stdin.readline

MOD = 998244353

def solve_string(s: str) -> int:
    n = len(s)

    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % MOD

    invfact = [1] * (n + 1)
    invfact[n] = pow(fact[n], MOD - 2, MOD)
    for i in range(n, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD

    def comb(a: int, b: int) -> int:
        if b < 0 or b > a:
            return 0
        return fact[a] * invfact[b] % MOD * invfact[a - b] % MOD

    if n == 1:
        return 1

    # runs = (L, R), inclusive.
    runs = []
    i = 0
    while i < n:
        j = i
        while j + 1 < n and s[j + 1] == s[i]:
            j += 1
        runs.append((i, j))
        i = j + 1

    # The whole string is unary.
    if len(runs) == 1:
        return n

    ans = 0

    # 1. Paths ending at a non-unary substring.
    #
    # For each l, let x be the first position after l with
    # s[x] != s[l]. Then [l, r] is non-unary iff r >= x.
    for L, R in runs:
        x = R + 1
        if x == n:
            continue

        for l in range(L, R + 1):
            # Sum over r = x .. n-1:
            #
            # C(l + n - 1 - r, l)
            #
            # = C(l + n - x, l + 1)
            ans += comb(l + n - x, l + 1)
            if ans >= MOD:
                ans -= MOD

    # 2. Paths whose first unary substring is a prefix of a run.
    #
    # The predecessor must extend one position to the left,
    # so L > 0 is required.
    for L, R in runs:
        if L == 0:
            continue

        for r in range(L, R + 1):
            ways_to_predecessor = comb(L + n - r - 2, L - 1)
            length = r - L + 1
            ans = (ans + ways_to_predecessor * length) % MOD

    # 3. Paths whose first unary substring is a suffix of a run.
    #
    # The predecessor must extend one position to the right,
    # so R < n - 1 is required.
    for L, R in runs:
        if R == n - 1:
            continue

        for l in range(L, R + 1):
            ways_to_predecessor = comb(l + n - R - 2, l)
            length = R - l + 1
            ans = (ans + ways_to_predecessor * length) % MOD

    return ans

def main() -> None:
    s = input().strip()
    print(solve_string(s))

if __name__ == "__main__":
    main()
```阶乘数组实现每个计数公式中使用的二项式系数。 模逆通过费马定理计算一次，其余组合是常数时间乘法。 

运行结构给出了每个最大等字符块的两个端点。 这已经足够了，因为第一个一元子串必须接触这样的块的边界。 我们永远不必自己构造子字符串。 

第一个计数循环对应于算法的非一元端点部分。 对于每个可能的左端点，所有有效的右端点都由从曲棍球棒恒等式获得的一个二项式系数表示。 这是消除明显的区间二次枚举的关键步骤。 

第二个循环处理第一个一元前缀。 前身是`[L-1,r]`，所以剩下的删除数是`L-1`，而正确删除的数量是`n-1-r`。 他们的总数给出了上面的参数`L+n-r-2`。 

第三个环路是对称的。 对于前任`[l,R+1]`， 有`l`留下删除和`n-R-2`正确的删除，给予`C(l+n-R-2,l)`。 

当两侧都存在时，循环故意包括来自两个方向的整个运行。 这是两条不同的路径，因为它们前面的顶点不同。 初始字符串本身是一元的唯一情况是在这些循环之前处理的。 

Python 整数不会溢出，但每次乘法都会减少模数`MOD`。 最大阶乘指数恰好是`n`, and all combination arguments stay within the precomputed range.

 ## 工作示例

 ### 示例 1：`abba`最大运行次数为`[0,0] = a`,`[1,2] = bb`， 和`[3,3] = a`。 

| 运行| 非一元贡献| 第一一元前缀贡献 | 一元后缀贡献 |
 | --- | --- | --- | --- |
 |`[0,0]`| 3 | 0 | 1 |
 |`[1,2]`| 2 | 3 | 3 |
 |`[3,3]`| 0 | 1 | 0 |
 | 总计 | 5 | 4 | 4 |

 非一元贡献是`5`。 例如，间隔`ab`,`abb`,`abba`,`ba`， 和`bba`考虑在到达一元子串之前结束的路径。 

为了跑步`bb`，一元前缀情况是`b`和`bb`，从左侧到达。 他们贡献`1 * 1 + 1 * 2 = 3`。 从右边开始，相应的后缀贡献`1 * 1 + 1 * 2 = 3`。 顶点的两次出现`bb`这些计算代表了不同的先前路径，因此这两个贡献仍然有效。 

总计为`5 + 4 + 4 = 13`，匹配示例输出。 

### 示例 2：`benbeipo`每个字符都属于长度为 1 的游程，因此字符串不包含重复的相邻字符。 

|`l`| 运行结束`R`| 非一元贡献| 一元贡献|
 | --- | --- | --- | --- |
 | 0 | 0 | 7 | 1 |
 | 1 | 1 | 21 | 21 6 |
 | 2 | 2 | 35 | 35 16 | 16
 | 3 | 3 | 35 | 35 25 | 25
 | 4 | 4 | 21 | 21 25 | 25
 | 5 | 5 | 7 | 16 | 16
 | 6 | 6 | 1 | 6 |
 | 7 | 7 | 0 | 1 |
 | 总计 | | 127 | 127 128 | 128

 由于串的长度不超过一个字符，因此每个一元子串的长度均为一。 因此，第一个一元贡献恰好是以单个字符结束的路径数，而非一元贡献则对较早结束的路径进行计数。 

两个总数分别是`127`和`128`, 给予`255`。 这正是`2^8 - 1`，这就是我们所期望的，每次删除两个端点总是会产生不同的字符串。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个位置都会被处理固定次数，并且每个二项式系数都是 O(1)。 |
 | 空间| O(n) | 阶乘数组和游程表示使用线性内存。 |

 和`n <= 300000`，该算法仅对输入执行恒定数量的传递和线性数量的模算术运算。 内存使用也是线性的，因此该解决方案完全符合规定的限制。 

## 测试用例```python
import sys
import io

MOD = 998244353

def solve_string(s: str) -> int:
    n = len(s)

    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % MOD

    invfact = [1] * (n + 1)
    invfact[n] = pow(fact[n], MOD - 2, MOD)
    for i in range(n, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD

    def comb(a, b):
        if b < 0 or b > a:
            return 0
        return fact[a] * invfact[b] % MOD * invfact[a - b] % MOD

    if n == 1:
        return 1

    runs = []
    i = 0
    while i < n:
        j = i
        while j + 1 < n and s[j + 1] == s[i]:
            j += 1
        runs.append((i, j))
        i = j + 1

    if len(runs) == 1:
        return n

    ans = 0

    for L, R in runs:
        x = R + 1
        if x == n:
            continue
        for l in range(L, R + 1):
            ans = (ans + comb(l + n - x, l + 1)) % MOD

    for L, R in runs:
        if L == 0:
            continue
        for r in range(L, R + 1):
            ans = (
                ans
                + comb(L + n - r - 2, L - 1) * (r - L + 1)
            ) % MOD

    for L, R in runs:
        if R == n - 1:
            continue
        for l in range(L, R + 1):
            ans = (
                ans
                + comb(l + n - R - 2, l) * (R - l + 1)
            ) % MOD

    return ans

def run(inp: str) -> str:
    return str(solve_string(inp.strip()))

# Provided samples
assert run("abba") == "13", "sample 1"
assert run("benbeipo") == "255", "sample 2"
assert run("iqiiiiiiqq") == "300", "sample 3"
assert run("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa") == "35", "sample 4"

# Custom cases
assert run("a") == "1", "minimum size"
assert run("aa") == "2", "unary boundary"
assert run("aab") == "6", "first unary substring"
assert run("aba") == "7", "two distinct endpoint transitions"
assert run("a" * 300000) == "300000", "maximum size and all equal"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a`| 1 | 最小长度和单顶点路径 |
 |`aa`| 2 | 折叠一元字符串上的两个端点转换 |
 |`aab`| 6 | 在路径末尾之前到达的第一个一元子字符串 |
 |`aba`| 7 | 两个端点删除仍然不同 |
 |`a`重复300000次| 300000 | 最大输入大小和完全一元情况 |

 ## 边缘情况

 对于`aa`，唯一的顶点是`aa`和`a`。 删除端点的两种方法`aa`产生相同的字符串`a`，因此该图仅包含一条边。 该算法检测到整个字符串是一次最大游程并立即返回`n = 2`。 

为了`aaa`，同样的特殊情况给出`3`。 图就是链`aaa -> aa -> a`，并且路径可以在其三个顶点中的任何一个处停止。 一般运行公式有意不计算初始一元字符串，因此显式一元字符串情况是必要的。 

为了`ab`，两次游程的长度均为一。 有3条路： 停在`ab`，删除第一个字符并停止于`b`，或删除最后一个字符并停在`a`。 非一元部分贡献 1，两个一元边界情况各贡献 1，给出`3`。 

为了`abba`，运行`bb`演示为什么必须同时计算第一一元前缀和后缀。 路径可以输入`bb`从`abb`或来自`bba`，即使它们到达相同的图顶点，它们也是不同的路径。 前缀和后缀计算贡献了两种可能性，生成示例答案`13`。 

对于最大尺寸的一元输入，包括`300000`的副本`a`，正好有`300000`图的顶点，每个可能的长度都有一个。 答案是`300000`。 该实现在不构造任何子字符串状态的情况下处理这种情况，并且仅使用显式一元字符串快捷方式。
