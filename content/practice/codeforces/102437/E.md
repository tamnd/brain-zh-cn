---
title: "CF 102437E - \u041f\u043e\u0445\u043e\u0436\u0438\u0435\u0437\u0430\u043a\u0430\u0437\u044b"
description: "我们有两个订单，每个订单由一个长度为 (n) 的字符串表示。 第 (i) 个字符描述堆栈中第 (i) 个盒子的商品编号。 我们需要确定当前订单（s）是否可以转换为先前订单（t）。"
date: "2026-08-12T07:59:52+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102437
codeforces_index: "E"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2019-2020, \u0427\u0435\u0442\u0432\u0451\u0440\u0442\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430, \u0443\u0441\u043b\u043e\u0436\u043d\u0435\u043d\u043d\u0430\u044f \u043d\u043e\u043c\u0438\u043d\u0430\u0446\u0438\u044f"
rating: 0
weight: 102437
solve_time_s: 836
verified: false
draft: false
---

[CF 102437E - \u041f\u043e\u0445\u043e\u0436\u0438\u0435 \u0437\u0430\u043a\u0430\u0437\u044b](https://codeforces.com/problemset/problem/102437/E)

 **评级：** -
 **标签：** -
 **求解时间：** 13m 56s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两个订单，每个订单由一个长度为 (n) 的字符串表示。 第 (i) 个字符描述堆栈中第 (i) 个盒子的商品编号。 我们需要确定当前订单（s）是否可以转换为先前订单（t）。 

允许的转换有两个独立的部分。 首先，每个字母都按相同的凯撒移位 (d) 进行移位，循环模 26。其次，堆栈可以旋转，这意味着 (s) 的前缀从顶部移动到底部。 如果旋转量为(k)，则得到的顺序为

 [
 s[k:] + s[]。 
]

 两次操作后，结果字符串必须等于 (t)。 我们必须输出任何有效的对 ((k,d))，或者报告`Impossible`。 

长度可以大到(200,000)。 检查每次旋转并比较所有 (n) 个字符的算法在最坏的情况下将执行最多 (n^2 = 40,000,000,000) 个字符比较，这远远超出了实际情况。 我们需要一个解决方案，其工作基本上与字符串长度呈线性关系。 

有几种边缘情况可能会破坏简单的实现。 第一个是（n=1）。 没有什么有意义的轮换可供寻找，但凯撒轮换可能仍然是必要的。 例如，```
1
z
a
```可以用 (k=0) 求解，因为移位`z`落后 25 给出`a`。 在这种情况下，假设有相邻字符需要检查的实现将失败。 

另一个边缘情况是字母表中的环绕。 例如，```
1
a
z
```也是可以解决的。 所需的平移可以表示为(d=1)，因为平移`z`向后 1 给出`y`，在移动时`a`向后 1 给出`z`。 该算术必须以模 26 执行，而不是使用普通的整数差。 

A third issue is rotation across the end of the string. 考虑```
5
abcde
bcdea
```旋转`bcdea`由 (4) 位置产生`abcde`，因此正确答案存在 (k=4) 和 (d=0)。 仅检查普通子串的搜索`s`忘记循环边界就会错过这个解决方案。 

最后，重复的字符可以使多次旋转有效。 例如，```
4
aaaa
aaaa
```将每个旋转视为有效旋转，并且 (d=0) 适用于所有旋转。 该算法必须接受第一个有效的候选者，而不是依赖唯一性。 

## 方法

 直接的解决方案是尝试每一种可能的旋转（k）。 对于每次旋转，我们会将旋转的 (s) 的每个字符与 (t) 的相应字符进行比较。 第一对位置确定凯撒移位，然后每个剩余位置必须具有完全相同的模 26 移位。此方法是正确的，因为它显式检查每个可能的变换。 

问题在于重复工作量。 有 (n) 次旋转，检查一次旋转需要 (O(n)) 时间。 在 (n=200,000) 时，最坏的情况达到 (200,000^2=40,000,000,000) 次字符检查。 蛮力在概念上很简单，但它的二次行为排除了它。 

有用的观察结果是凯撒移位不会改变相邻字母之间的差异。 如果`x`更改为`x-d`和`y`更改为`y-d`，那么他们的差异仍然存在

 [
 (y-d)-(x-d)=y-x \pmod {26}。 
]

 因此，我们可以比较连续字母之间差异的循环序列，而不是比较原始字母。 

对于字符串 (x)，定义

 (x[(i+1)\bmod n]-x[i])\bmod 26。 
]

 该序列恰好有 (n) 个元素，因为它还包含从最后一个字符到第一个字符的差异。 

假设将 (s) 旋转 (k) 个位置给出了凯撒移位之前的正确排列。 它的循环差序列就是从位置(k)开始的(s)的循环差序列。 凯撒转变根本不会改变任何差异。 因此，当(t)的循环差序列作为(s)的循环差序列的循环旋转出现时，恰好存在有效旋转。 

在另一个循环序列中查找一个循环序列是一个标准的字符串匹配问题。 我们可以将(s)的差分序列与其自身连接起来，并使用Knuth-Morris-Pratt算法在(O(n))时间内找到(t)的差分序列。 一旦找到匹配的起始位置 (k)，凯撒移位就由第一个字符确定：

 [
 d=(s[k]-t[0])\bmod 26。 
]

 差异表示解决了旋转问题，而 KMP 使搜索呈线性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2)) | (O(n)) | (O(n)) | 太慢了|
 | 最佳 | (O(n)) | (O(n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 将 (s) 和 (t) 的每个字符转换为 0 到 25 之间的数值。这使我们可以使用普通模运算来执行所有凯撒移位运算。 
2. 构建循环差分数组`ds`对于（s）。 对于每个位置 (i)，存储从 (s[i]) 到 (s[(i+1)\bmod n]) 的差值，模 26。`dt`对于(t)，以完全相同的方式。 
3. 构建KMP前缀函数`dt`。 前缀函数告诉我们在不匹配后有多少模式仍然可用，因此搜索永远不必从头开始。 
4. 搜索`dt`里面`ds + ds`。 循环数组的旋转对应于其双倍版本的连续段。 我们只接受从小于 (n) 的索引开始的匹配，因为这些正是 (n) 可能的轮换。 
5. 如果没有这样的匹配，则打印`Impossible`。 匹配循环差异对于有效的变换是必要的，因此凯撒移位无法修复丢失的旋转。 
6. 如果比赛从 (k) 开始，计算

 [
 d=(s[k]-t[0])\bmod 26。 
]

 旋转的字符串开始于`s[k]`。 将该字符向后移动 (d) 必须产生`t[0]`，所以这个方程准确地给出了所需的凯撒位移。 

1. 打印`Success`，然后是 (k) 和 (d)。 模 26 产生的值介于 0 和 25 之间，满足所需范围 (-26<d<26)。 

### 为什么它有效

 中心不变量是，当且仅当两个字符串相应的循环差相等时，两个字符串仅通过均匀凯撒移位不同。 当两个相邻字符相减时，凯撒移位会取消，因此它不会影响差异数组。 

旋转 (k) 只是改变循环差数组的起始点。 搜寻中`dt`里面`ds + ds`因此准确地找到其相对字符结构与 (t) 相匹配的旋转。 一旦找到这样的旋转，每个相邻的差异都一致，因此旋转的 (s) 和 (t) 之间的差异在整个周期中是恒定的。 该常数正是从第一个字符计算出的凯撒位移。 因此，每个报告的对 ((k,d)) 都会生成 (t)，并且如果存在有效对，则其旋转必须出现在 KMP 搜索中。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def build_diff(s):
    n = len(s)
    if n == 1:
        return []
    return [
        (ord(s[(i + 1) % n]) - ord(s[i])) % 26
        for i in range(n)
    ]

def prefix_function(pattern):
    m = len(pattern)
    pi = [0] * m

    for i in range(1, m):
        j = pi[i - 1]

        while j > 0 and pattern[i] != pattern[j]:
            j = pi[j - 1]

        if pattern[i] == pattern[j]:
            j += 1

        pi[i] = j

    return pi

def solve():
    n = int(input())
    t = input().strip()
    s = input().strip()

    if n == 1:
        d = (ord(s[0]) - ord(t[0])) % 26
        print("Success")
        print(0, d)
        return

    ds = build_diff(s)
    dt = build_diff(t)

    pi = prefix_function(dt)

    j = 0
    doubled = ds + ds

    for i, value in enumerate(doubled):
        while j > 0 and value != dt[j]:
            j = pi[j - 1]

        if value == dt[j]:
            j += 1

        if j == n:
            start = i - n + 1

            if start < n:
                d = (ord(s[start]) - ord(t[0])) % 26
                print("Success")
                print(start, d)
                return

            j = pi[j - 1]

    print("Impossible")

if __name__ == "__main__":
    solve()
```这`build_diff`函数将字符串转换为其循环差序列。 表达式`(i + 1) % n`处理最终到第一条边，这是必要的，因为旋转是循环的而不是普通的子串操作。 

(n=1) 情况单独处理，因为它的差异序列将为空。 只有一种可能的旋转（k=0），凯撒移位可以直接从两个角色获得。 

前缀函数仅计算`dt`。 在 KMP 搜索过程中，`ds + ds`表示每次循环旋转`ds`作为正常的连续段。 前 (n) 个可能的起始位置完全对应于 (k=0,\ldots,n-1)。 

当KMP达到`j == n`，整个目标差异序列已匹配。 表达式`i - n + 1`给出该场比赛的开始时间。 我们拒绝从 (n) 或之后开始，因为这些是通过加倍数组创建的重复匹配。 

最后，`d = (ord(s[start]) - ord(t[0])) % 26`直接遵循凯撒行动的方向。 如果旋转后的字符是`c`，将其向后移动 (d) 给出`c-d`，所以我们需要`c-d = t[0] (mod 26)`。 重新排列给出代码中使用的表达式。 

Python 整数具有任意精度，因此不存在溢出问题。 所有索引都保持在 (2n) 之内，并且每个字符转换都是恒定时间。 

## 工作示例

 ### 示例 1

 输入是```
3
abc
fde
```循环差异如下。 

| 字符串| 差分序列|
 | --- | --- |
 |`t = abc`|`[1, 1, 24]`|
 |`s = fde`|`[24, 1, 1]`|

 将差分序列加倍`s`给出`[24, 1, 1, 24, 1, 1]`。 目标序列`[1, 1, 24]`首先发生在位置 (1)。 

| KMP状态| 价值| 图案位置| 结果 |
 | --- | --- | --- | --- |
 | 开始 | 24 | 0 | 不匹配|
 | 在索引 1 | 之后 1 | 1 | 比赛|
 | 索引 2 之后 | 1 | 2 | 比赛|
 | 索引 3 | 之后 24 | 3 | 完整比赛 |

 因此(k=1)。 旋转`fde`通过一个位置给出`def`。 它的第一个字符是`d`，而目标开始于`a`，所以

 [
 d=(d-a)\bmod26=3。 
]

 变速`def`向后 3 给出`abc`，所以算法打印`Success`,`1 3`。 

### 示例 2

 输入是```
3
abc
aba
```循环差为

 | 字符串| 差分序列|
 | --- | --- |
 |`t = abc`|`[1, 1, 24]`|
 |`s = aba`|`[25, 25, 0]`|

 的双倍序列`s`是`[25, 25, 0, 25, 25, 0]`，其中不包含出现`[1, 1, 24]`。 

| 搜索位置 | 当前差异| 目标进度|
 | --- | --- | --- |
 | 0 | 25 | 25 0 |
 | 1 | 25 | 25 0 |
 | 2 | 0 | 0 |
 | 3 | 25 | 25 0 |
 | 4 | 25 | 25 0 |
 | 5 | 0 | 0 |

 没有旋转具有与以下相同的相对特征变化`t`，因此不存在可以使字符串相等的凯撒移位。 答案是`Impossible`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n)) | (O(n)) | 构建两个差异数组、构建 KMP 的前缀函数以及搜索双倍数组都需要线性时间。 |
 | 空间| (O(n)) | (O(n)) | 差分数组、加倍序列和前缀函数都需要线性内存。 |

 对于 (n\le200,000)，算法仅对输入执行恒定数量的线性传递。 它的内存使用也是线性的，因此它适合规定的约束。 

## 测试用例

 成功输出不是唯一的，因此强大的测试工具应该验证返回的转换，而不是逐字比较完整的输出字符串。 下面的测试代码可以做到这一点，同时仍然检查确切的`Impossible`样品。```python
import sys
import io

def solve_data(inp: str) -> str:
    data = inp.strip().split()
    n = int(data[0])
    t = data[1]
    s = data[2]

    def build_diff(x):
        if n == 1:
            return []
        return [
            (ord(x[(i + 1) % n]) - ord(x[i])) % 26
            for i in range(n)
        ]

    if n == 1:
        d = (ord(s[0]) - ord(t[0])) % 26
        return f"Success\n0 {d}\n"

    ds = build_diff(s)
    dt = build_diff(t)

    pi = [0] * n
    for i in range(1, n):
        j = pi[i - 1]
        while j > 0 and dt[i] != dt[j]:
            j = pi[j - 1]
        if dt[i] == dt[j]:
            j += 1
        pi[i] = j

    j = 0
    for i, value in enumerate(ds + ds):
        while j > 0 and value != dt[j]:
            j = pi[j - 1]

        if value == dt[j]:
            j += 1

        if j == n:
            k = i - n + 1
            if k < n:
                d = (ord(s[k]) - ord(t[0])) % 26
                return f"Success\n{k} {d}\n"
            j = pi[j - 1]

    return "Impossible\n"

def run(inp: str) -> str:
    return solve_data(inp)

def valid_output(inp: str, out: str) -> bool:
    data = inp.strip().split()
    n = int(data[0])
    t = data[1]
    s = data[2]

    lines = out.strip().split()

    if lines[0] == "Impossible":
        return len(lines) == 1

    if lines[0] != "Success" or len(lines) != 3:
        return False

    k = int(lines[1])
    d = int(lines[2])

    if not (0 <= k < n and -26 < d < 26):
        return False

    rotated = s[k:] + s[:k]

    transformed = "".join(
        chr((ord(c) - ord('a') - d) % 26 + ord('a'))
        for c in rotated
    )

    return transformed == t

# Provided samples.
assert run("""3
abc
fde
""") == "Success\n1 3\n"

assert run("""3
abc
aba
""") == "Impossible\n"

assert valid_output(
    """1
z
a
""",
    run("""1
z
a
""")
)

# Minimum-size, no transformation needed.
assert valid_output(
    """1
a
a
""",
    run("""1
a
a
""")
)

# All characters equal, with a non-zero Caesar shift.
assert valid_output(
    """4
zzzz
aaaa
""",
    run("""4
zzzz
aaaa
""")
)

# Rotation by n - 1, exercising the cyclic boundary.
assert valid_output(
    """5
abcde
bcdea
""",
    run("""5
abcde
bcdea
""")
)

# Maximum-size input, all characters equal.
n = 200000
max_case = f"{n}\n" + "a" * n + "\n" + "a" * n + "\n"
assert valid_output(max_case, run(max_case))
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / a / a`|`Success`, (k=0,d=0) | 最小尺寸和空差序列 |
 |`4 / zzzz / aaaa`|`Success`，任意旋转且 (d=1) | 全相等字符串和模块化凯撒算术 |
 |`5 / abcde / bcdea`|`Success`, (k=4,d=0) | 绕末端旋转 |
 | (n=200000)，全部`a`|`Success`, (k=0,d=0) | 最大输入尺寸和线性性能|

 ## 边缘情况

 对于（n=1），差异数组不包含元素，因此KMP没有意义。 考虑```
1
z
a
```只有一种可能的旋转，(k=0)。 所需的班次是

 [
 (z-a)\bmod26=25。 
]

 算法返回`Success`,`0 25`。 这相当于样本的`0 -25`因为凯撒移位是循环模 26，并且两个值代表相同的变换。 

对于字母环绕，请考虑```
1
a
z
```该算法计算

 [
 (a-z)\bmod26=1。 
]

 变速`a`向后 1 产生`z`， 所以`Success 0 1`是有效的。 模运算可防止负原始差值被视为无效移位。 

对于穿过字符串末端的旋转，请考虑```
5
abcde
bcdea
```的循环差分序列`s`被搜索到`ds + ds`。 目标从位置 (4) 开始，对应于旋转

 # \texttt{a}+\texttt{bcde}

 \texttt{abcde}。 
]

 KMP 发现 (k=4)，并且第一个字符已经一致，因此 (d=0)。 

对于重复的字符，请考虑```
4
aaaa
aaaa
```每个循环差为零，因此每次旋转都匹配。 KMP 接受第一个字符 (k=0)，第一个字符给出 (d=0)。 无需区分多个有效答案，因为问题接受其中任何一个。 

最微妙的正确性情况是差异序列匹配但字符串最初不具有相同的第一个字符。 例如，```
3
abc
def
```两个串的循环差序列为`[1, 1, 24]`，因此 (k=0) 是有效的结构匹配。 第一个字符的差异给出

 [
 d=(d-a)\bmod26=3。 
]

 变速`def`落后 3 产生`abc`。 这说明了为什么仅匹配差异并不是最后一步，但它减少了确定一个全局凯撒移位的剩余工作。
