---
title: "CF 102174B - \u70bc\u91d1\u672f"
description: "我们有 (m) 个现有材料，每个材料都由一个小写字符串 (si) 表示。 如果新材料的字符串具有精确的长度 (n)，则它是可接受的，但它不能作为任何现有 (si) 的连续子字符串出现。"
date: "2026-08-19T15:18:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102174
codeforces_index: "B"
codeforces_contest_name: "The 14-th BIT Campus Programming Contest"
rating: 0
weight: 102174
solve_time_s: 138
verified: true
draft: false
---

[CF 102174B - \u70bc\u91d1\u672f](https://codeforces.com/problemset/problem/102174/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (m) 个现有材料，每个材料都由一个小写字符串 (s_i) 表示。 如果新材料的字符串具有精确的长度 (n)，则它是可接受的，但它不能作为任何现有 (s_i) 的连续子字符串出现。 我们只需要输出一个这样的字符串，并且该语句保证有一个存在。 

看待这个问题的有用方法是忘记化学术语并提出一个纯字符串问题：在所有长度为 (n) 的 (26^n) 个小写字符串中，找到输入字符串的所有长度为 (n) 的子字符串集合中不存在的一个。 

让

 [
 S=\sum_i |s_i|。 
]

 我们有 (S\le 3\times 10^5)，而 (n) 可以大到 (10^5)。 这立即排除了依赖于 (26^n) 的算法，因为即使 (26^{10}) 也已经远远超出了我们可以枚举的范围。 它还排除了直接根据每个输入字符串检查每个候选者的情况。 总输入本身只有几十万个字符，因此预期的解决方案应该大致线性地处理它。 

有一个特别有用的计数观察。 字符串 (s_i) 最多包含 (|s_i|-n+1) 个长度为 (n) 个子字符串的不同起始位置，因此不同禁止字符串的总数最多为

 [
 \sum_i \max(0, |s_i|-n+1)\le S.
 ]

 因此，虽然有 (26^n) 个可能的答案，但实际上最多 (3\times10^5) 个答案是可以被禁止的。 我们只需要一种方法来枚举少量候选人并快速测试成员资格。 

一种边缘情况是每个现有字符串都短于 (n)。 例如，```
3 2
a
bc
```任何地方都没有长度为 3 的子串，所以`aaa`已经是一个有效的答案。 假设每个输入字符串至少贡献一个窗口的粗心实现可能会产生不正确的循环边界或空候选集。 

当第一个候选存在但下一个候选不存在时，会出现另一种边缘情况。 例如，```
3 1
aaaa
```字符串`aaa`发生，但是`aab`没有。 正确的输出可以是`aab`。 仅检查重复候选字符的实现，例如`aaa`,`bbb`等会错过有效答案。 

第三种情况是(n=1)。 例如，```
1 25
a
b
c
d
e
f
g
h
i
j
k
l
m
n
o
p
q
r
s
t
u
v
w
x
y
```每个单字母字符串，除了`z`是被禁止的，所以`z`就是答案。 当字符串仅包含一个位置时，候选生成代码必须起作用。 

## 方法

 直接暴力方法在概念上很简单。 枚举长度为 (n) 的 (26^n) 个小写字符串中的每一个，并针对每个候选值检查它是否出现在任何输入字符串中。 如果我们使用直接的子字符串匹配，在最坏的情况下检查一个候选可能需要 (O(Sn)) 时间，给出

 [
 O(26^nSn)。 
]

 即使使用完美的查找结构将子串成员资格减少到 (O(1))，对于大 (n) 来说，仅枚举 (26^n) 个候选者已经是不可能的。 蛮力是正确的，因为它检查完整的答案空间，但答案空间比输入指数大。 

关键的观察结果是输入只能禁止线性数量的长度 (n) 字符串。 在所有输入字符串中，最多有 (S) 个长度为 (n) 的窗口。 因此，在检查最多 (S+1) 个不同候选者之后，至少有一个候选者必须缺席。 

这彻底改变了问题。 我们不需要理解所有（26^n）个字符串。 我们可以按字典顺序枚举候选者，一旦发现其指纹不属于禁止子串的指纹集，就停止。 

滚动多项式哈希让我们可以在每个窗口的 (O(1)) 摊销时间内计算每个长度 (n) 窗口的指纹。 我们将所有这些指纹存储在哈希集中。 然后我们枚举以以下开头的候选字符串`aaa...a`， 其次是`aaa...b`， 等等。 候选者可以作为一个基数26的计数器来维护，并且它的散列可以根据变化的位置进行更新。 在 (K) 个连续候选者中，更改的尾随位置的总数为 (O(K))，因此候选者的生成与候选者的数量也是线性的。 

散列引入了通常发生冲突的可能性。 我们使用大素数模 (2^{61}-1) 并随机选择基数。 冲突可以使禁止的候选者看起来也被禁止，因此它只能延迟搜索，而不会导致我们输出实际存在的字符串。 对于随机 61 位多项式哈希，影响预期复杂性的足够冲突的概率可以忽略不计。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(26^nSn)) | (O(n)) | (O(n)) | 太慢了 |
 | 滚动哈希+候选枚举| 预期 (O(S+n)) | (O(S+n)) | 已接受 |

 ## 算法演练

 1.读取(n)和所有现有字符串，并选择随机多项式哈希基。 我们使用质数模 (P=2^{61}-1)，它提供了非常大的哈希空间，同时保持 Python 整数运算的可管理性。 
2. 预计算 (B^n\bmod P)。 这是当长度（n）滚动窗口向右移动一个位置时删除最旧字符所需的因素。 
3. 使用长度为 (n) 的滚动窗口扫描每个输入字符串。 如果字符串短于 (n)，则它不提供禁止候选者。 否则，计算每个长度（n）窗口的散列并将其插入到集合中。 
4. 初始化候选者`a`重复(n)次。 它的多项式哈希是根据每个字符都有值 (1) 的事实计算的。 这是按字典顺序排列的最小可能长度 (n) 字符串。 
5. 检查候选哈希是否存在于禁止哈希集中。 如果不存在，则立即输出候选者。 输入字符串中出现的候选者必须与存储的窗口之一具有完全相同的哈希值，因此丢失的哈希值证明该候选者不存在。 
6. 如果候选值被禁止，则将其递增为 26 进制数。 从最后一个位置开始，每个尾随`z`变成`a`，以及第一个非`z`角色加一。 对于每个更改的位置，通过添加更改乘以基数的适当幂来更新候选哈希。 
7. 重复成员资格检查并递增，直到找到丢失的散列。 不能有超过 (S) 个不同的禁止字符串，因此在最多 (S+1) 个不同的候选字符串之后，必须出现有效的答案，忽略哈希冲突的可忽略的概率。 

为什么它有效：禁止哈希集包含每个现有材料的每个实际长度（n）子串的指纹。 候选枚举按字典顺序访问不同的长度 (n) 字符串。 每当集合中不存在其散列时，候选者就不能等于任何现有的长度（n）子串，因此它是有效的新材料。 由于输入总共最多可以包含 (S) 个长度为 (n) 的窗口，因此它不能禁止超过 (S) 个不同的候选者。 因此，前 (S+1) 个候选者之一必须是有效的。 

## Python 解决方案```python
import sys
import random

input = sys.stdin.readline

MOD = (1 << 61) - 1

def solve():
    n, m = map(int, input().split())

    # Randomized base makes adversarial hash collisions extremely unlikely.
    base = random.randrange(256, MOD - 1)

    pow_n = pow(base, n, MOD)

    forbidden = set()

    for _ in range(m):
        s = input().strip()
        if len(s) < n:
            continue

        h = 0

        # Hash of the first window.
        for i in range(n):
            h = (h * base + (ord(s[i]) - 96)) % MOD
        forbidden.add(h)

        # Roll the window.
        for i in range(n, len(s)):
            old = ord(s[i - n]) - 96
            new = ord(s[i]) - 96
            h = (h * base + new - old * pow_n) % MOD
            forbidden.add(h)

    # Candidate is represented by values 0..25.
    # Its polynomial character values are values + 1.
    candidate = bytearray(b'a' * n)

    # Hash of a^n.
    h = (pow(base, n, MOD) - 1) * pow(base - 1, MOD - 2, MOD) % MOD

    # The formula above is the geometric sum:
    # 1 * base^(n-1) + ... + 1.
    #
    # Handle base == 1, which is astronomically unlikely but easy to avoid.
    if base == 1:
        h = n % MOD

    powers = [1] * n
    for i in range(1, n):
        powers[i] = powers[i - 1] * base % MOD

    while True:
        if h not in forbidden:
            sys.stdout.write(candidate.decode())
            return

        # Increment the base-26 number.
        pos = n - 1

        while pos >= 0 and candidate[pos] == ord('z'):
            # z -> a changes the character value from 26 to 1.
            h = (h - 25 * powers[n - 1 - pos]) % MOD
            candidate[pos] = ord('a')
            pos -= 1

        if pos < 0:
            # The statement guarantees that an answer exists.
            return

        # Increase the first non-z character by one.
        h = (h + powers[n - 1 - pos]) % MOD
        candidate[pos] += 1

if __name__ == "__main__":
    solve()
```输入字符串一次处理一个，因此无需将所有字符串保存在内存中。 对于长度至少为 (n) 的字符串，直接对第一个窗口进行哈希处理。 每个后续窗口都是通过乘以基数、添加新字符并减去旧字符乘以 (B^n) 来从先前的哈希中获得的。 

候选人被存储为`bytearray`，这避免了在搜索时重复构造 Python 字符串。 它的字符被视为从 (1) 到 (26) 的值，而字节值本身是从 (1) 到 (26) 的 ASCII 代码`a`到`z`。 

当 26 进制计数器递增时，可以在本地更新候选哈希。 如果位置从`a`到`b`，其哈希贡献增加 (B^k)。 如果它改变自`z`到`a`，其贡献减少 (25B^k)。 指数 (k=n-1-\text{pos}) 正是其右侧的位置数。 

幂数组以此指数为索引。 自从候选人开始`a`，其初始哈希值是几何和 (1+B+\cdots+B^{n-1})。 特别的`base == 1`分支避免了几何和公式中被零除的情况，尽管随机选择实际上使该事件不可能发生。 

Python 中不存在整数溢出问题，因为整数具有任意精度。 每次算术更新后都会应用模数，使存储的哈希值保持在 (2^{61}) 范围内。 

## 工作示例

 对于第一个样本，输入是```
3 1
a
```唯一存在的字符串的长度小于 (n=3)，因此它不会贡献长度为 3 的禁止子字符串。 

| 候选人 | 禁止集中的哈希值？ | 行动|
 | --- | --- | --- |
 |`aaa`| 没有 | 输出`aaa`|

 示例输出使用`zzz`，但接受任何有效字符串。 这里`aaa`是有效的，因为唯一现有的材料是`a`，它没有长度为三的子串。 

对于第二个样本，输入是```
3 2
ac
ak
```同样，两个现有字符串的长度均为 2，因此都不包含长度为 3 的子字符串。 

| 候选人 | 禁止集中的哈希值？ | 行动|
 | --- | --- | --- |
 |`aaa`| 没有 | 输出`aaa`|

 提供的输出`fun`是另一个有效的答案。 该跟踪还检验了输入字符串比请求的答案长度恰好短一个字符的边界。 

对于第一个候选实际上被禁止的情况，请考虑```
3 1
aaaa
```长度为 3 的窗口都是`aaa`，因此禁止集仅包含以下哈希值`aaa`。 

| 候选人 | 禁止集中的哈希值？ | 行动|
 | --- | --- | --- |
 |`aaa`| 是的 | 增加候选人|
 |`aab`| 没有 | 输出`aab`|

 重复出现`aaa`仅存储一次，因为禁止结构是一个集合。 候选人`aab`不存在，因此搜索立即停止。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 预期 (O(S+n)) | 每个输入字符都参与一次滚动哈希更新，并且最多检查 (S+1) 个候选字符。 候选增量需要 (O(1)) 摊销时间。 |
 | 空间| (O(S+n)) | 该集合最多包含 (S) 个哈希，而候选数组和幂数组使用 (O(n)) 内存。 |

 这里 (S\le3\times10^5)，因此算法仅处理几十万个字符并维护类似大小的哈希集。 这与规定的 256 MB 内存限制兼容，并且避免了 (n) 中的每个指数因子。 

## 测试用例```python
import io
import random

MOD = (1 << 61) - 1

def solve_data(inp: str) -> str:
    data = inp.split()
    it = iter(data)

    n = int(next(it))
    m = int(next(it))

    base = random.randrange(256, MOD - 1)
    pow_n = pow(base, n, MOD)

    forbidden = set()

    for _ in range(m):
        s = next(it)

        if len(s) < n:
            continue

        h = 0
        for i in range(n):
            h = (h * base + ord(s[i]) - 96) % MOD
        forbidden.add(h)

        for i in range(n, len(s)):
            old = ord(s[i - n]) - 96
            new = ord(s[i]) - 96
            h = (h * base + new - old * pow_n) % MOD
            forbidden.add(h)

    candidate = bytearray(b'a' * n)

    powers = [1] * n
    for i in range(1, n):
        powers[i] = powers[i - 1] * base % MOD

    if base == 1:
        h = n % MOD
    else:
        h = (pow(base, n, MOD) - 1) * pow(base - 1, MOD - 2, MOD) % MOD

    while True:
        if h not in forbidden:
            return candidate.decode()

        pos = n - 1

        while pos >= 0 and candidate[pos] == ord('z'):
            h = (h - 25 * powers[n - 1 - pos]) % MOD
            candidate[pos] = ord('a')
            pos -= 1

        assert pos >= 0, "The original problem guarantees an answer."

        h = (h + powers[n - 1 - pos]) % MOD
        candidate[pos] += 1

# Provided sample 1.
assert solve_data("""\
3 1
a
""") == "aaa", "sample 1"

# Provided sample 2.
assert solve_data("""\
3 2
ac
ak
""") == "aaa", "sample 2"

# Minimum n. Every character except z is forbidden.
case = "1 25\n" + "\n".join(chr(ord('a') + i) for i in range(25)) + "\n"
assert solve_data(case) == "z", "minimum n"

# Off-by-one case: aaa occurs in aaaa, but aab does not.
assert solve_data("""\
3 1
aaaa
""") == "aab", "window boundary"

# Multiple strings cover every length-2 string beginning with a.
case = "2 26\n" + "\n".join("a" + chr(ord('a') + i) for i in range(26)) + "\n"
assert solve_data(case) == "ba", "candidate increment"

# Maximum-size input. The only forbidden length-100000 string is a^100000.
# The next lexicographic candidate is a^(99999)b.
n = 100000
s = "a" * 300000
case = f"{n} 1\n{s}\n"
assert solve_data(case) == "a" * (n - 1) + "b", "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 25`其次是`a`通过`y`|`z`| 最少 (n) 且完整覆盖 25 个字母符号 |
 |`3 1 / aaaa`|`aab`| 禁止的第一个候选者和精确的长度（n）窗口边界 |
 |`2 26`其次是`aa`通过`az`|`ba`| Base-26 候选增量和过渡`az`到`ba`|
 |`100000 1 / a`重复300000次|`a...ab`| 最大值 (n)、最大总输入大小和长候选处理 |

 ## 边缘情况

 当每个输入字符串都短于 (n) 时，禁止集保持为空。 为了```
3 2
a
bc
```根本不存在长度为 3 的窗口。 候选人开始为`aaa`，它的哈希不存在，算法输出`aaa`立即地。 关键的边界是`len(s) < n`检查，这可以防止尝试构造不存在的窗口。 

当第一个候选出现时，算法不会假设不同的重复字符串将起作用。 为了```
3 1
aaaa
```唯一不同的长度为 3 的子串是`aaa`。 第一个候选人被拒绝，计数器将其最后位置从`a`到`b`，生产`aab`，第二个候选人被接受。 

当 (n=1) 时，幂数组只有一个元素，候选数组只有一个字节。 为了```
1 25
a
b
...
y
```候选人在字母表中一次移动一个字符，直到到达`z`。 单字符字符串的枚举逻辑没有特殊情况。 

当候选增量跨越一系列`z`字符，每个尾随`z`必须成为`a`在前面的字符递增之前。 例如，之后`azz`，下一个候选者是`baa`， 不是`bzz`或者`aza`。 哈希更新为每个重置位置减去 (25B^k)，然后添加增量位置的贡献。 这是最有可能出现差一错误的部分，因此`az`到`ba`测试明确地练习了它。
