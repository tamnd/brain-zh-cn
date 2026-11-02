---
title: "CF 17E - 栅栏"
description: "给定一个字符串，我们考虑其中的每个回文子串。 即使两个子字符串具有相同的文本，每次出现的情况都是单独的。 例如，在“aaa”中，“a”出现了三种不同的情况。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "strings"]
categories: ["algorithms"]
codeforces_contest: 17
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 17"
rating: 2900
weight: 17
solve_time_s: 230
verified: true
draft: false
---
[CF 17E - 栅栏](https://codeforces.com/problemset/problem/17/E)

 **评分：** 2900
 **标签：** 字符串
 **求解时间：** 3m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个字符串，我们考虑其中的每个回文子串。 即使两个子字符串具有相同的文本，每次出现的情况都是单独的。 例如，在`"aaa"`存在三种不同的情况`"a"`。 

每个回文对应一个区间`[l, r]`。 我们必须计算有多少个无序的不同回文区间相交。 如果两个区间至少共享一个位置，则它们相交。 

直接的解释是：

 1. 枚举每个回文子串。 
2. 考虑每一对。 
3. 计算间隔重叠的对。 

字符串长度可以达到`2 * 10^6`，这完全改变了可行的方法。 甚至一个`O(n^2)`算法在这里是不可能的。 对所有对进行二次扫描将需要大约`4 * 10^12`最坏情况下的操作。 我们需要接近线性时间的东西。 

另一个隐藏的困难是回文子串的数量本身已经可以是二次的。 像这样的字符串`"aaaa....a"`大致包含`n(n+1)/2`回文。 我们无法显式存储所有间隔。 

模数`51123987`也很重要。 中间计数可能会变得巨大，因此每个算术运算都应保持对该值求模。 

有几种容易被忽略的边缘情况。 

考虑最小的输入：```
1
a
```回文数只有一个，所以答案是`0`。 粗心的实现可能会意外地计算出与自身配对的回文数。 

现在考虑：```
2
aa
```回文是：

 -`[1,1]`-`[2,2]`-`[1,2]`相交对是：

 -`[1,1]`和`[1,2]`-`[2,2]`和`[1,2]`答案是`2`。 如果我们计算非重叠对并从总对中减去，我们必须小心不要重复计算有序对。 

另一个棘手的例子是：```
4
abba
```回文：

 - 四个单字母
 -`"bb"`-`"abba"`回文`"abba"`与所有其他回文相交。 仅关注局部中心的算法常常会忘记覆盖许多较小中心的长回文。 

最坏的情况是重复的字符串：```
5
aaaaa
```每个子串都是一个回文。 有`15`总共是回文，所以有`105`无序对。 仅应排除不相交的间隔对。 任何显式生成所有回文的实现都将耗尽时间和内存。`n`。 

## 方法

 蛮力的想法很简单。 我们枚举每个回文子串，存储所有间隔，然后测试每对子串是否重叠。 

检查一个子串是否是回文本身就需要线性时间，但即使我们使用中心扩展或 Manacher 算法进行优化，回文总数可能仍然是`O(n^2)`。 生成它们后，测试所有对会花费另一个二次因子。 

对于一个长度的字符串`2 * 10^6`，回文数的数量约为`2 * 10^12`。 成对比较变得非常大。 

关键的观察是直接计算相交对很尴尬，但计算不相交对要容易得多。 

假设我们知道：

 -`T`= 回文子串的总数。 
-`D`= 无序不相交回文对的数量。 

那么答案很简单：```
T choose 2 - D
```当一个回文在另一个开始之前结束时，两个回文就是不相交的。 

这将问题变成了更加结构化的问题。 如果我们可以计算：

 - 每个位置有多少个回文结束，
 - 每个位置有多少个回文开始，

 然后我们可以计算具有前缀和的不相交对。 

剩下的挑战是在不单独枚举每个回文的情况下获得这些计数。 

这正是 Manacher 算法的用武之地。 Manacher 在线性时间内计算：

 - 每个中心的最大奇数回文半径，
 - 每个中心的最大偶数回文半径。 

每个半径紧凑地代表许多回文。 

根据这些半径，我们可以使用差异数组重建每个索引处有多少个回文开始或结束。 我们不是单独迭代每个回文，而是一次添加整个范围。 

这给出了`O(n)`解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^4) naive，O(n^2) with Manacher enumeration | O(n^2) | O(n^2) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 运行 Manacher 算法来计算奇回文半径。 

对于每个位置`i`,`d1[i]`存储以 为中心的奇数回文数`i`。 

示例：如果`d1[i] = 3`，那么回文有半径`1,2,3`。 
2. 运行 Manacher 算法来计算偶数回文半径。 

对于每个位置`i`,`d2[i]`存储中间的偶数回文数`i-1`和`i`。 
3. 计算回文总数。 

每个半径都贡献了那么多的回文数。```
total = sum(d1) + sum(d2)
```4. 构建数组`start[]`和`end[]`。`start[i]`将包含从位置开始的回文数`i`。`end[i]`将包含以位置结束的回文数`i`。 
5. 使用差异更新来填充这些数组。 

对于以`i`有半径`k`：

 - 起始范围为`i-k+1`到`i`- 结束范围为`i`到`i+k-1`我们不是单独添加每个回文，而是添加`+1`使用差异数组在这些间隔上。 
6. 对偶数回文重复相同的过程。 

如果偶数回文有中心`i`和半径`k`：

 - 起始范围为`i-k`到`i-1`- 结束范围为`i`到`i+k-1`7. 使用前缀和将差异数组转换为实际计数。 
8. 构建前缀和`end[]`。 

让：```
pref[i] = number of palindromes ending at or before i
```9. 计算不相交的对。 

对于每个起始位置`i`，所有回文开始于`i`与之前结尾的每个回文都不相交`i`。 

所以我们添加：```
start[i] * pref[i-1]
```10. 计算最终答案。 

无序对总数：```
total * (total - 1) / 2
```减去不相交的对并取模。 

### 为什么它有效

 每对不同的回文都恰好属于以下两类之一：

 - 相交，
 - 脱节。 

当左回文数在右回文数开始之前结束时，一对是不相交的。 通过固定右回文的起始位置，我们可以使用结束位置的前缀和来计算所有兼容的左回文。 

Manacher 算法保证每个回文通过其中心和半径精确地表示一次。 差异数组重建正确地保留了多重性，因为每个有效半径都贡献一个具有唯一起点和终点的回文。 

由于每个不相交的对都只计算一次，因此从无序对的总数中减去正好留下相交的对。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 51123987

def solve():
    n = int(input())
    s = input().strip()

    # Manacher odd
    d1 = [0] * n
    l = 0
    r = -1

    for i in range(n):
        k = 1 if i > r else min(d1[l + r - i], r - i + 1)

        while i - k >= 0 and i + k < n and s[i - k] == s[i + k]:
            k += 1

        d1[i] = k

        if i + k - 1 > r:
            l = i - k + 1
            r = i + k - 1

    # Manacher even
    d2 = [0] * n
    l = 0
    r = -1

    for i in range(n):
        k = 0 if i > r else min(d2[l + r - i + 1], r - i + 1)

        while i - k - 1 >= 0 and i + k < n and s[i - k - 1] == s[i + k]:
            k += 1

        d2[i] = k

        if i + k - 1 > r:
            l = i - k
            r = i + k - 1

    total = (sum(d1) + sum(d2)) % MOD

    start_diff = [0] * (n + 1)
    end_diff = [0] * (n + 1)

    # Odd palindromes
    for i in range(n):
        k = d1[i]

        L = i - k + 1
        R = i

        start_diff[L] += 1
        if R + 1 < n:
            start_diff[R + 1] -= 1

        L = i
        R = i + k - 1

        end_diff[L] += 1
        if R + 1 < n:
            end_diff[R + 1] -= 1

    # Even palindromes
    for i in range(n):
        k = d2[i]

        if k == 0:
            continue

        L = i - k
        R = i - 1

        start_diff[L] += 1
        if R + 1 < n:
            start_diff[R + 1] -= 1

        L = i
        R = i + k - 1

        end_diff[L] += 1
        if R + 1 < n:
            end_diff[R + 1] -= 1

    start = [0] * n
    end = [0] * n

    cur = 0
    for i in range(n):
        cur += start_diff[i]
        start[i] = cur

    cur = 0
    for i in range(n):
        cur += end_diff[i]
        end[i] = cur

    pref = [0] * n
    pref[0] = end[0]

    for i in range(1, n):
        pref[i] = pref[i - 1] + end[i]

    disjoint = 0

    for i in range(1, n):
        disjoint += start[i] * pref[i - 1]
        disjoint %= MOD

    total_pairs = total * (total - 1) // 2
    total_pairs %= MOD

    ans = (total_pairs - disjoint) % MOD

    print(ans)

solve()
```第一部分是标准 Manacher 算法。 奇数和偶数版本是分开的，因为它们的对称规则略有不同。`d1[i]`存储计数，而不是字符的半径长度。 如果`d1[i] = 3`，实际回文长度是`1,3,5`。 

差分数组部分是微妙的部分。 

认为`d1[i] = k`。 那么正好有`k`奇数回文数以`i`。 它们的起始位置形成一个连续的区间。 我们不是迭代每个半径，而是增加整个间隔`O(1)`时间。 

同样的逻辑也适用于结束位置。 

重建后`start[]`和`end[]`，我们计算不相交的对。 对于每个职位`i`，从那里开始的每个回文都可以与之前结束的每个回文配对`i`。 

这里的顺序很重要。 我们只计算左回文较早结束的对，因此每个无序不相交对只计算一次。 

另一个重要的细节是整数增长。 回文总数大约可以是`2 * 10^12`，因此具有固定宽度整数的语言将会溢出。 Python 整数是安全的，但我们仍然频繁地进行取模运算。 

## 工作示例

 ### 示例 1

 输入：```
4
babb
```马纳彻结果：

 | 位置 | 人物 | d1 | d2 |
 | --- | --- | --- | --- |
 | 0 | 乙| 1 | 0 |
 | 1 | 一个 | 2 | 0 |
 | 2 | 乙| 1 | 0 |
 | 3 | 乙| 1 | 1 |

 回文总数：

 | 回文| 间隔|
 | --- | --- |
 | 乙| [1,1]|
 | 巴布 | [1,3]|
 | 一个 | [2,2]|
 | 乙| [3,3]|
 | BB | [3,4]|
 | 乙| [4,4]|

 现在计算开始和结束。 

| 位置 | 开始 | 结束 | 首选项 |
 | --- | --- | --- | --- |
 | 1 | 2 | 1 | 1 |
 | 2 | 1 | 1 | 2 |
 | 3 | 2 | 2 | 4 |
 | 4 | 1 | 2 | 6 |

 不相交的对：

 - 从 2 开始：`1 * 1 = 1`- 3点开始：`2 * 2 = 4`- 4点开始：`1 * 4 = 4`总不相交 =`9`。 

回文总数 =`6`。 

总无序对 =`15`。 

答案=`15 - 9 = 6`。 

该跟踪显示了为什么计算不相交对比直接测试重叠更简单。 

### 示例 2

 输入：```
5
aaaaa
```每个子串都是一个回文。 

| 长度 | 计数 |
 | --- | --- |
 | 1 | 5 |
 | 2 | 4 |
 | 3 | 3 |
 | 4 | 2 |
 | 5 | 1 |

 回文总数 =`15`。 

| 位置 | 开始 | 结束 |
 | --- | --- | --- |
 | 1 | 5 | 1 |
 | 2 | 4 | 2 |
 | 3 | 3 | 3 |
 | 4 | 2 | 4 |
 | 5 | 1 | 5 |

 不相交的对：

 - 位置 2：`4 * 1 = 4`- 位置 3：`3 * 3 = 9`- 位置 4：`2 * 6 = 12`- 位置 5：`1 * 10 = 10`总不相交 =`35`。 

总对 =`105`。 

相交对 =`70`。 

这个例子强调了最坏情况下的回文密度。 该算法仍然保持线性，因为它从不显式地具体化所有间隔。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | Manacher、差异更新和前缀扫描都是线性的 |
 | 空间| O(n) | 半径、计数和前缀和的数组 |

 和`n = 2 * 10^6`，线性复杂度是必要的。 该解决方案仅对字符串执行恒定次数的传递，并存储一些大小的整数数组`n`，它完全符合内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

MOD = 51123987

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n = int(input())
    s = input().strip()

    d1 = [0] * n
    l = 0
    r = -1

    for i in range(n):
        k = 1 if i > r else min(d1[l + r - i], r - i + 1)

        while i - k >= 0 and i + k < n and s[i - k] == s[i + k]:
            k += 1

        d1[i] = k

        if i + k - 1 > r:
            l = i - k + 1
            r = i + k - 1

    d2 = [0] * n
    l = 0
    r = -1

    for i in range(n):
        k = 0 if i > r else min(d2[l + r - i + 1], r - i + 1)

        while i - k - 1 >= 0 and i + k < n and s[i - k - 1] == s[i + k]:
            k += 1

        d2[i] = k

        if i + k - 1 > r:
            l = i - k
            r = i + k - 1

    total = sum(d1) + sum(d2)

    start_diff = [0] * (n + 1)
    end_diff = [0] * (n + 1)

    for i in range(n):
        k = d1[i]

        start_diff[i - k + 1] += 1
        if i + 1 < n:
            start_diff[i + 1] -= 1

        end_diff[i] += 1
        if i + k < n:
            end_diff[i + k] -= 1

    for i in range(n):
        k = d2[i]

        if k == 0:
            continue

        start_diff[i - k] += 1
        if i < n:
            start_diff[i] -= 1

        end_diff[i] += 1
        if i + k < n:
            end_diff[i + k] -= 1

    start = [0] * n
    end = [0] * n

    cur = 0
    for i in range(n):
        cur += start_diff[i]
        start[i] = cur

    cur = 0
    for i in range(n):
        cur += end_diff[i]
        end[i] = cur

    pref = [0] * n
    pref[0] = end[0]

    for i in range(1, n):
        pref[i] = pref[i - 1] + end[i]

    disjoint = 0

    for i in range(1, n):
        disjoint += start[i] * pref[i - 1]

    ans = total * (total - 1) // 2 - disjoint

    return str(ans % MOD) + "\n"

# provided sample
assert run("4\nbabb\n") == "6\n", "sample 1"

# minimum size
assert run("1\na\n") == "0\n", "single character"

# all equal
assert run("2\naa\n") == "2\n", "all substrings palindromic"

# odd and even palindromes together
assert run("4\nabba\n") == "7\n", "mixed palindrome types"

# no palindrome longer than 1
assert run("5\nabcde\n") == "0\n", "all palindromes disjoint"

# repeated characters
assert run("5\naaaaa\n") == "70\n", "dense palindrome structure"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / a`|`0`| 没有自我配对计数 |
 |`2 / aa`|`2`| 基本偶数回文处理 |
 |`4 / abba`|`7`| 长偶回文与单身互动|
 |`5 / abcde`|`0`| 完全不相交的单字母回文 |
 |`5 / aaaaa`|`70`| 最坏情况回文密度 |

 ## 边缘情况

 考虑最小的可能字符串：```
1
a
```马纳赫给出：

 -`d1 = [1]`-`d2 = [0]`恰好有一个回文数。 无序对总数为零，因为：```
1 * 0 / 2 = 0
```该算法从不尝试将回文与自身配对，因为所有配对计数都基于不同的间隔。 

现在考虑：```
2
aa
```回文：

 -`[1,1]`-`[2,2]`-`[1,2]`唯一不相交的对是无，因为每对都重叠。 总对数为`3`。 减去零个不相交对后，答案变为`2`因为无序的不同回文对是：

 -`[1,1]`和`[1,2]`-`[2,2]`和`[1,2]`该算法通过以下方式正确处理偶数回文`d2`。 

现在检查：```
5
abcde
```仅存在单字符回文。 

每个回文都在自己的位置开始和结束。 由于没有间隔重叠，所以每对都是不相交的。 

该算法计算：```
total = 5
total pairs = 10
disjoint = 10
answer = 0
```这证实了当所有回文都被隔离时，基于前缀的不相交计数可以正常工作。 

最后是密集案例：```
5
aaaaa
```每个子串都是一个回文。 回文数是二次的，但 Manacher 仍然将所有内容紧凑地存储在线性空间中：

 - 奇数半径编码所有奇数回文，
 - 偶数半径编码所有偶数回文。 

差异数组更新聚合了大量的间隔，而无需单独迭代它们，这就是为什么即使在最坏的情况下解决方案也保持线性的原因。
