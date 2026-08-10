---
title: "CF 102437B - 破解密码"
description: "我们从长度为 n 的字符串 s 开始。 我们可以重复删除一个字符，但只能删除当前占据前两个位置之一或后两个位置之一的字符。 经过 n-k 次删除后，剩下的字符就形成了密码。"
date: "2026-08-09T12:40:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102437
codeforces_index: "B"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2019-2020, \u0427\u0435\u0442\u0432\u0451\u0440\u0442\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430, \u0443\u0441\u043b\u043e\u0436\u043d\u0435\u043d\u043d\u0430\u044f \u043d\u043e\u043c\u0438\u043d\u0430\u0446\u0438\u044f"
rating: 0
weight: 102437
solve_time_s: 373
verified: true
draft: false
---

[CF 102437B - 破解代码](https://codeforces.com/problemset/problem/102437/B)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个字符串开始`s`长度`n`。 我们可以重复删除一个字符，但只能删除当前占据前两个位置之一或后两个位置之一的字符。 恰好之后`n-k`删除，剩下的字符构成密码。 在所有可能的长度密码中`k`，我们需要字典顺序最小的一个。 

约束条件`n <= 500000`排除字符串长度的任何二次方。 甚至`O(nk)`当`k`接近于`n`，所以我们需要一个主要工作接近线性或最坏的解决方案`O(n log n)`。 26 个小写字母的小字母有助于一些边界选择，但它本身并不能解决问题，因为字典比较可能依赖于很长的公共前缀。 

第一个边缘情况是`k = n`。 无法删除，因此答案就是原始字符串。 例如，与`s = "abc"`和`k = 3`，答案是`abc`。 始终假设至少一个删除的解决方案可能会意外访问无效的第二个或倒数第二个位置。 

第二个边缘情况是`k = 1`。 每个单独的字符都可以保留为最后一个字符，因为我们可以从左侧重复删除，直到该字符成为第一个字符。 因此答案是整个字符串中最小的字符。 为了`s = "zba"`和`k = 1`，答案是`a`。 

第三个边缘情况是`k = 2`。 在这种情况下，每对位置都可以成为两个幸存的字符。 为了`s = "bac"`和`k = 2`，可能的答案包括`ac`和`ba`，所以答案是`ac`。 简单地对两个最小的字符进行排序会建议`ab`， 但`ab`不是以下的子序列`bac`并且无法生产。 

当只有一个删除可用时，会出现更微妙的边界情况。 为了`s = "abcde"`和`k = 4`，我们无法删除`c`，因为最初只`a`,`b`,`d`， 和`e`是可以访问的。 可能的字符串是`bcde`,`acde`,`abce`， 和`abcd`，所以答案是`abcd`。 将操作视为任意子序列删除的解决方案将错误地允许`abde`。 

## 方法

 直接的暴力解决方案可以递归地尝试所有四个删除操作。 这是正确的，因为每个合法操作都被明确考虑，因此每个可到达的字符串都出现在递归树中的某个位置。 然而，之后`n-k`树的删除次数达到`4^(n-k)`操作顺序。 和`n = 500000`，即使是这个搜索空间的一小部分也是不可能探索的。 存储所有不同的中间字符串也太昂贵。 

有用的观察来自于观察幸存的位置而不是消失的角色。 在此过程中，剩余位置的形状始终受到很大限制。 它们由一个连续的间隔组成，可能在该间隔之前有一个附加的幸存位置，也可能在该间隔之后有一个附加的幸存位置。 

要了解原因，请从整个字符串（一个音程）开始。 如果我们删除第一个字符，我们就会缩短从左边开始的间隔。 如果我们删除第二个字符，第一个字符可以保留为单例，而其余字符保持连续。 同样的论点对称地适用于右边。 重复这个过程永远无法创建复杂的间隔集合。 最多可以从中心连续区间的每一侧分离一个单例。 

反之亦然。 假设幸存位置是一个连续的间隔，可选地在其之前有一个幸存字符，并且可选地在其之后有一个幸存字符。 中心间隔之前的所有内容都可以从左侧删除，通过重复删除第二个位置来保留可选的左侧字符。 中心区间之后的所有内容都可以从右侧对称处理。 因此，具有此结构的每个字符串都是可访问的。 

因此，每个可访问的密码都有四种形式之一。 它可以是长度连续的子串`k`。 它可以是一个字符后跟一个长度为连续的子字符串`k-1`。 它可以是长度连续的子串`k-1`后跟一个字符。 或者它可以是一个字符，然后是长度连续的子字符串`k-2`，然后是一个字符。 

剩下的挑战是有效地找到固定长度的字典顺序最小的子串。 我们构造一个后缀数组`s`。 对于两个长度相同的子串，它们的字典顺序与相应后缀的顺序相同，除非子串相等。 我们根据后缀的第一个对后缀进行分组`m`使用后缀数组及其 LCP 数组的字符。 这给出了每个长度-`m`子字符串紧凑的字典顺序。 

一旦这些等级可用，四种结构情况中的每一种都变成线性扫描。 对于表格`c + middle`，第一个字符在比较中占主导地位，其次是排名`middle`。 为了`middle + c`，中间的子字符串首先占主导地位，然后是最后一个字符。 为了`c + middle + d`，按顺序进行比较`c`,`middle`,`d`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(4^(n-k))`状态 | 指数| 太慢了|
 | 最佳|`O(n log n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 手柄`k = 1`和`k = 2`直接地。 对于一个字符，选择最少的字符。 对于两个字符，扫描每个可能的第一个位置并将其与后面出现的最小字符配对。 这是可行的，因为每个两个位置的子序列都是可达的。 
2. 对于`k >= 3`,构造后缀数组`s`哨兵比每个小写字母都小。 后缀数组给出了所有后缀的字典顺序。 
3. 使用 Kasai 算法构建 LCP 数组。 连续后缀之间的 LCP 值告诉我们它们的公共前缀有多长。 
4.对于所需的中间长度`m`，扫描后缀数组，并将相同的排名分配给连续的后缀，其LCP至少为`m`。 当两个位置的长度相同时，它们的排名完全相同`m`子串相等。 排名按字典顺序排列。 
5. 考虑长度恰好是一个连续子串的密码`k`。 在所有有效的起始位置中，选择长度最小的位置-`k`子串排名。 
6. 考虑以下形式的密码`c + middle`， 在哪里`middle`有长度`k-1`。 对于每个可能的起始位置`middle`, 最好的可能`c`是该位置之前出现的最小字符。 首先比较候选人`c`，然后按等级`middle`。 
7. 考虑以下形式的密码`middle + c`。 对于长度为每个可能的中间子串`k-1`，选择其后最小的字符。 首先按中间子字符串的排名比较候选者，然后按最后一个字符进行比较。 
8. 考虑以下形式的密码`c + middle + d`， 在哪里`middle`有长度`k-2`。 对于每个可能的中间开始，选择其前面的最小字符和后面的最小字符。 比较候选人`c`，然后是中间排名，然后`d`。 
9. 从四种形式中的每一种中重建最佳候选者，并在最后进行比较。 只有四个完整的候选者，因此直接比较它们的成本最多`O(k)`额外工作总量。 

为什么它有效

 中心不变量是每组可到达的幸存位置恰好是一个连续的区间，每侧至多有一个额外位置。 删除操作保留了该属性，并且可以通过从相应侧删除不需要的字符来构造具有该属性的每个集合。 

算法中的四种情况恰好列举了这四种可能的形状。 在每种情况下，所选的边界字符都会独立最小化，因为它们出现在连续中间之前或之后。 后缀派生的排名可以正确比较中间子字符串，因为在一种情况下所有中间子字符串都具有相同的长度。 因此，每种情况都会产生按字典顺序排列的最小可访问密码，并取这四个候选者中的最小值给出全局最优值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def build_suffix_array(s):
    n = len(s)

    # 1..26 are letters, 0 is the unique sentinel.
    a = [x - 96 for x in s] + [0]
    N = n + 1

    cnt = [0] * 27
    for x in a:
        cnt[x] += 1

    pos = [0] * 27
    for i in range(1, 27):
        pos[i] = pos[i - 1] + cnt[i - 1]

    p = [0] * N
    for i, x in enumerate(a):
        p[pos[x]] = i
        pos[x] += 1

    c = [0] * N
    classes = 1
    for i in range(1, N):
        if a[p[i]] != a[p[i - 1]]:
            classes += 1
        c[p[i]] = classes - 1

    shift = 1
    while shift < N:
        pn = [
            x - shift if x >= shift else x - shift + N
            for x in p
        ]

        cnt = [0] * classes
        for x in pn:
            cnt[c[x]] += 1

        pos = [0] * classes
        total = 0
        for i in range(classes):
            pos[i] = total
            total += cnt[i]

        p_new = [0] * N
        for x in pn:
            cls = c[x]
            p_new[pos[cls]] = x
            pos[cls] += 1

        c_new = [0] * N
        new_classes = 1
        for i in range(1, N):
            cur = p_new[i]
            prev = p_new[i - 1]

            cur_pair = (c[cur], c[(cur + shift) % N])
            prev_pair = (c[prev], c[(prev + shift) % N])

            if cur_pair != prev_pair:
                new_classes += 1

            c_new[cur] = new_classes - 1

        p = p_new
        c = c_new
        classes = new_classes
        shift <<= 1

    # Remove the sentinel suffix.
    return p[1:], a

def build_lcp(suffix_array, a):
    N = len(a)
    rank = [0] * N

    for i, pos in enumerate(suffix_array):
        rank[pos] = i

    lcp = [0] * N
    common = 0

    for i in range(N):
        r = rank[i]

        if r == 0:
            continue

        j = suffix_array[r - 1]

        while i + common < N and j + common < N:
            if a[i + common] != a[j + common]:
                break
            common += 1

        lcp[r] = common

        if common:
            common -= 1

    return lcp

def fixed_length_ranks(suffix_array, lcp, n, length):
    """
    rank[i] is the lexicographic rank of s[i:i+length].
    Equal substrings receive the same rank.
    """
    rank = [0] * n

    group = -1

    for idx, pos in enumerate(suffix_array):
        if idx == 0:
            group = 0
        elif lcp[idx] < length:
            group += 1

        rank[pos] = group

    return rank

def best_by_rank(rank, lo, hi):
    best = lo

    for i in range(lo + 1, hi + 1):
        if rank[i] < rank[best]:
            best = i

    return best

def solve_instance(s, k):
    n = len(s)

    if k == 1:
        return min(s)

    if k == 2:
        best = None
        right_min = s[-1]

        for i in range(n - 2, -1, -1):
            candidate = s[i] + right_min

            if best is None or candidate < best:
                best = candidate

            if s[i] < right_min:
                right_min = s[i]

        return best

    suffix_array, a = build_suffix_array(s)
    lcp = build_lcp(suffix_array, a)

    values = s.encode()

    # Prefix minima and suffix minima of characters.
    pref = bytearray(n)
    suf = bytearray(n + 1)

    pref[0] = values[0]
    for i in range(1, n):
        pref[i] = min(pref[i - 1], values[i])

    suf[n] = 123
    for i in range(n - 1, -1, -1):
        suf[i] = min(suf[i + 1], values[i])

    candidates = []

    # Case 1: one contiguous substring of length k.
    ranks = fixed_length_ranks(suffix_array, lcp, n, k)
    start = best_by_rank(ranks, 0, n - k)
    candidates.append(values[start:start + k])

    # Case 2: one character + substring of length k - 1.
    middle_len = k - 1
    ranks = fixed_length_ranks(
        suffix_array, lcp, n, middle_len
    )

    best_key = None
    best_start = -1
    best_left = -1

    for start in range(1, n - middle_len + 1):
        left_char = pref[start - 1]
        key = (left_char, ranks[start])

        if best_key is None or key < best_key:
            best_key = key
            best_start = start
            best_left = left_char

    candidates.append(
        bytes([best_left]) +
        values[best_start:best_start + middle_len]
    )

    # Case 3: substring of length k - 1 + one character.
    best_key = None
    best_start = -1
    best_right = -1

    for start in range(0, n - middle_len):
        end = start + middle_len
        right_char = suf[end]
        key = (ranks[start], right_char)

        if best_key is None or key < best_key:
            best_key = key
            best_start = start
            best_right = right_char

    candidates.append(
        values[best_start:best_start + middle_len] +
        bytes([best_right])
    )

    # Case 4: one character + substring of length k - 2
    # + one character.
    middle_len = k - 2
    ranks = fixed_length_ranks(
        suffix_array, lcp, n, middle_len
    )

    best_key = None
    best_start = -1
    best_left = -1
    best_right = -1

    for start in range(1, n - middle_len):
        end = start + middle_len

        left_char = pref[start - 1]
        right_char = suf[end]

        key = (left_char, ranks[start], right_char)

        if best_key is None or key < best_key:
            best_key = key
            best_start = start
            best_left = left_char
            best_right = right_char

    candidates.append(
        bytes([best_left]) +
        values[best_start:best_start + middle_len] +
        bytes([best_right])
    )

    return min(candidates).decode()

def solve():
    s = input().strip()
    k = int(input())
    print(solve_instance(s, k))

if __name__ == "__main__":
    solve()
```该实现首先处理两个最小值`k`分别地。 这避免了必须表示空的中间间隔。 为了`k = 2`，每对幸存位置都是可到达的，因此从右到左的后缀最小值就足够了。 

对于较大的`k`,`build_suffix_array`添加一个比每个真实角色都小的哨兵。 标准加倍结构通过代表后缀第一个的等价类对重复对后缀进行排序`2^h`人物。 计数排序使每个加倍阶段保持线性，给出`O(n log n)`施工时间。`build_lcp`使用Kasai算法。 LCP 数组是必需的，因为后缀等级单独区分后缀，即使它们的第一个后缀也是如此。`m`字符是平等的。`fixed_length_ranks`只要公共前缀的长度至少达到，就合并连续的后缀`m`，产生长度的精确词典类别`m`子串。 

前缀和后缀最小值存储在`bytearray`对象。 这使得它们的内存消耗很小，同时仍然允许在每个中间间隔恒定时间访问尽可能小的外部字符。 

这四种情况的范围是故意不同的。 对于左侧额外字符，中间必须至少从位置开始`1`，但可能结束于`n-1`。 对于右侧的额外字符，中间可能从`0`，但其结尾必须在其后留下一个字符。 如果有两个附加项，则这两个限制均适用。 这些是最有可能出现相差一错误的地方。 

Python 中整数不能溢出，后缀数组仅存储整数索引和等级。 最终的候选者是字节字符串，这也使得字典比较高效。 

## 工作示例

 ### 示例 1

 对于`s = "abacaba"`和`k = 3`，四种结构形式的长度中等`3`,`2`,`2`， 和`1`。 

| 表格 | 最佳建筑| 候选人 |
 | --- | --- | --- |
 | 仅中间 |`aba`|`aba`|
 | 左+中|`a`+`ab`|`aab`|
 | 中+右|`ab`+`a`|`aba`|
 | 左+中+右 |`a`+`a`+`a`|`aaa`|

 最后一种形式获胜。 其幸存位置是`1, 3, 5`。 开始于`abacaba`,删除第二个字符`b`，然后是倒数第二个字符`b`，然后还有两个可访问的`c`和`b`根据需要的字符，留下`aaa`。 

跟踪的重要部分是答案不是连续的子字符串。 仅考虑子字符串的解决方案将停止于`aab`，而允许的左右单例位置使得`aaa`可能的。 

### 示例 2

 对于`s = "qwerty"`和`k = 2`，每对位置都是可达的。 

| 第一名 | 最好的第二个角色| 候选人 |
 | --- | --- | --- |
 |`q`|`e`|`qe`|
 |`w`|`e`|`we`|
 |`e`|`r`|`er`|
 |`r`|`t`|`rt`|
 |`t`|`y`|`ty`|

 最小的候选者是`er`。 

这个案例也说明了为什么`k = 2`快捷方式很有用。 答案只是长度为 2 的字典顺序最小子序列，可以使用后缀最小值找到它，而无需构造后缀数组。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n log n)`| 后缀数组结构占主导地位； LCP、固定长度排名和候选扫描是线性的 |
 | 空间|`O(n)`| 后缀数组、LCP数组、秩数组、辅助数组都是线性的|

 和`n <= 500000`,`O(n log n)`是可行的，而暴力状态空间呈指数增长。 后缀数组构造一次，然后通过线性扫描处理结构情况所需的三个固定子串长度。 

## 测试用例```
# Save the submitted solution as solution.py before running this block.
from solution import solve_instance

def run(inp: str) -> str:
    lines = inp.strip().splitlines()
    s = lines[0].strip()
    k = int(lines[1])
    return solve_instance(s, k)

# Provided samples
assert run("abacaba\n3\n") == "aaa", "sample 1"
assert run("qwerty\n2\n") == "er", "sample 2"

# Minimum-size input
assert run("z\n1\n") == "z", "minimum size"

# Two-character password, catches incorrect sorting of characters
assert run("bac\n2\n") == "ac", "two-character subsequence"

# Only one deletion is possible, so the interior character cannot be removed
assert run("abcde\n4\n") == "abcd", "one deletion boundary"

# All characters equal
assert run("aaaaa\n3\n") == "aaa", "all equal"

# No deletion is required
assert run("abc\n3\n") == "abc", "k equals n"

# Maximum-size case
s = "z" * 500000
assert run(s + "\n250000\n") == "z" * 250000, "maximum size"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`z / 1`|`z`| 最小可能的输入和`k = 1`|
 |`bac / 2`|`ac`| 两位子序列和排序 |
 |`abcde / 4`|`abcd`| 内部的字符不能立即删除 |
 |`aaaaa / 3`|`aaa`| 相等的字符和重复的子串排名 |
 |`abc / 3`|`abc`| 没有删除|
 |`z...z / 250000`|`z...z`| 最大输入大小和高度重复的后缀 |

 ## 边缘情况

 对于`s = "zba"`和`k = 1`，算法立即返回`a`。 通过删除相应一侧的字符，可以使每个字符成为唯一的幸存者，因此最小字符就足够了。 

为了`s = "bac"`和`k = 2`，该算法从右到左扫描可能的第一个位置，同时将最小的字符保留在其右侧。 它认为`ac`从职位`2,3`和`ba`从职位`1,3`，选择`ac`。 诱人的弦`ab`无法形成，因为幸存的字符必须保留其原始顺序。 

为了`s = "abcde"`和`k = 4`，仅删除了五个字符。 可访问的字符有`a`,`b`,`d`， 和`e`， 所以`c`无法删除。 四个结果字符串的最小值`abcd`。 结构表征也直接看到了这一点：删除`c`会留下两个非单例区间，这不是四种可达形式之一。 

为了`s = "abacaba"`和`k = 3`, 最优密码`aaa`有幸存职位`1`,`3`， 和`5`。 这些位置形成左单例、单字符中间间隔和右单例。 这正是删除操作所允许的最通用的形状。 

为了`s = "abc"`和`k = 3`，每个有效的结构情况都会重建原始字符串，并且不执行删除。 答案依然存在`abc`，确认边界计算不需要实际的可移动字符。 

对于完全由以下内容组成的最大尺寸字符串`500000`的副本`z`，每个可能的长度-`k`中间子串是相同的。 固定长度排序过程将它们分组到相同的等价类中，因此任何有效的起始位置都是可接受的，并且结果答案是预期的`k`的副本`z`。 

如果您愿意，我还可以提供此社论的**较短的 Codeforces 风格版本**，保留相同的证明，但大大减少了实现讨论。
