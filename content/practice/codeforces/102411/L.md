---
title: "CF 102411L - 长度和周期"
description: "我们有一个长度最多为 200000 的字符串 w。我们想要找到其中重复次数最多的子串，其中允许重复在下一个副本的中途停止。 假设一个子串的周期为p，长度为L。它的指数为L / p。"
date: "2026-08-11T07:53:30+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102411
codeforces_index: "L"
codeforces_contest_name: "ICPC 2019-2020 North-Western Russia Regional Contest"
rating: 0
weight: 102411
solve_time_s: 722
verified: true
draft: false
---

[CF 102411L - 长度和周期](https://codeforces.com/problemset/problem/102411/L)

 **评级：** -
 **标签：** -
 **求解时间：** 12m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个字符串`w`最多长度`200000`。 我们想要找到其中重复次数最多的子字符串，其中允许重复在下一个副本的中途停止。 

假设一个子串有句点`p`和长度`L`。 它的指数是`L / p`。 例如，`abababa`有月经`2`，因为无论两个位置都存在，每个字符都与两个位置之后的字符一致。 它的指数是`7 / 2`。 任务是在每个子串和每个有效周期内最大化该比率。 

答案不一定是整数。 子字符串可以包含一个句点的多个完整副本，然后包含一个副本的前缀。 所需的输出是最大比率，减少到最低项。 

的长度界限为`200000`排除任何显式检查所有子字符串然后比较它们的字符的行为。 已经有大约`n²/2`子串，所以即使每个子串持续工作也太多了。 一个算法围绕`O(n log n)`适合两秒限制。 最终的解决方案使用了`O(n log n)`后缀数组构造、线性时间 LCP 构造和预期`O(n log n)`所设工会的总工作量。 

有几种小情况很容易处理不当。 为了`a`，没有一对不同的后缀，也没有重复，但答案仍然是`1/1`，因为单个字符的指数为 1。 将答案初始化为零的解决方案可能会意外地产生无效分数。 

为了`abc`，没有子串的周期比它自己的长度短，所以答案是`1/1`。 仅搜索重复对的解决方案可能找不到任何结果，并且仍必须返回一个。 

为了`aba`，整个字符串有句点`2`: 前两个字符是`ab`，剩下的字符就是前缀`a`那个时期的。 它的指数是`3/2`。 仅考虑完整重复的解决方案将错过这个分数答案并错误地返回`1/1`。 

为了`aaaa`，整个字符串有句点`1`, 给出指数`4/1`。 这种情况还暴露了低效的实现，因为每对后缀都有一个很长的公共前缀。 所有对的逐个字符比较变成三次。 

## 方法

 直接方法可以枚举两个位置`i < j`并尊重`j - i`作为候选期。 然后我们比较`w[i:]`和`w[j:]`逐个字符找到它们的最长公共前缀。 如果该 LCP 有长度`L`，子串开始于`i`并在这些之后结束`L`匹配的字符有长度`L + (j-i)`和期间`j-i`，所以它给出指数

 [
 \frac{L+(j-i)}{j-i}。 
]

 这是正确的，因为每个带句点的有效重复`p`给出两个后缀开头`p`位置分开，其公共前缀包含除句点的第一个副本之外的所有内容。 

问题是成本。 有`Theta(n²)`对`(i,j)`，并且单个 LCP 比较可以采取`Theta(n)`时间。 在一个字符串上，例如`aaaa...a`，几乎每次比较都会扫描线性数量的字符。 总工作量为`Theta(n³)`， 大约`8 * 10^15`字符比较时`n = 200000`，远远超出了极限。 

关键的观察结果是，我们实际上并不需要独立计算每个 LCP。 后缀数组将所有后缀按照字典顺序排列，任意两个后缀的LCP是它们的排列之间的间隔上的最小LCP值。 如果`height[k]`是后缀数组条目的 LCP`k-1`和`k`，那么

 [
 LCP(i,j)=\min(高度[r_i+1],\ldots,高度[r_j])。 
]

 这将问题转化为阈值连接问题。 

想象一下处理`height`值从最大到最小。 当我们达到一个值时`h`，连接每对相邻的后缀，其 LCP 至少为`h`。 连接组件现在恰好包含共享至少长度的前缀的后缀`h`。 

在这样的组件中，我们需要两个后缀，它们在原始字符串中的起始位置尽可能接近。 如果他们的立场不同`d`，他们的 LCP 至少是`h`，所以它们产生长度有效的子字符串`h+d`有时期`d`。 它的指数是

 [
 \frac{h+d}{d}。 
]

 对于固定的`h`，最大化该比率与最小化完全相同`d`。 

剩下的数据结构问题是维持每个 DSU 组件中两个原始字符串位置之间的最小距离。 由于位置是整数，因此有序集就足够了。 当两个组件合并时，我们需要它们并集内的最小距离。 我们将每个组件维护为由原始字符串位置键入的随机陷阱。 每个trap节点都存储其子树中的第一个位置、最后一个位置以及连续位置之间的最小间隙。 treap union 有效地组合两个不相交的有序集。 

后缀数组提供 LCP 信息，降序扫描提供正确的阈值分量，DSU 维护这些分量，treap 维护最接近的一对原始位置。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(n³)`|`O(n)`| 太慢了|
 | 最佳 | 预期的`O(n log n)`|`O(n)`| 已接受 |

 ## 算法演练

 1.构建后缀数组`w`。 后缀数组包含按字典顺序排列的每个后缀起始位置。 我们使用前缀加倍和计数排序，因此每轮加倍都会花费`O(n)`并且有`O(log n)`回合。 
2. 使用Kasai 算法构建LCP 阵列。 对于每个后缀数组等级`r > 0`,`height[r]`存储后缀的 LCP`sa[r-1]`和`sa[r]`。 Kasai 重复利用了之前的 LCP，使整个结构变得线性。 
3. 解释每一个`height[r]`作为后缀数组位置之间的边`r-1`和`r`。 价值边缘`h`表示这两个后缀共享一个长度前缀`h`。 
4. 按高度递减对 LCP 正边缘进行排序。 最初，每个后缀都是其自己的 DSU 组件。 当处理有值的边时`h`，合并它的两个组件。 结果组件中的所有后缀至少共享一个长度为的前缀`h`。 
5. 将有序陷阱与每个 DSU 组件相关联。 键是原始字符串中相应后缀的起始位置。 每个trap存储组件中两个键之间的最小差异。 
6. 合并高度的边后`h`， 让`d`是由此产生的陷阱存储的最小距离。 选择起始位置不同的两个后缀`d`。 他们的共同前缀长度至少`h`，所以由第一个组成的子串`d`该公共前缀后面的字符具有长度`d+h`和期间`d`。 它的指数是`(d+h)/d`。 
7. 使用交叉乘法将该分数与当前最佳答案进行比较。 我们比较`a/b`和`c/d`作为`a*d`相对`c*b`，完全避免浮点运算。 
8. 忽略零 LCP 值。 他们只能产生指数`1`，这已经是最初的答案`1/1`。 
9. 在打印之前将最终的分子和分母减去它们的最大公约数。 分母始终为正，并且所有中间值都适合 Python 整数。 

### 为什么它有效

 考虑从位置开始的任意两个后缀`i < j`，并让`d = j-i`。 如果他们的 LCP 是`L`，然后是位置处的字符`i+k`和`j+k`对于每一个都是平等的`0 <= k < L`。 由于第二个后缀正好开始`d`个字符之后，长度的子串`d+L`开始于`i`有月经`d`。 因此，每个后缀对都给出一个有效的指数`(d+L)/d`。 

现在考虑任何带句点的有效子字符串`p`和长度`T`。 它的第一个`T-p`字符等于子字符串开头`p`后面的位置，因此前两个周期位置的后缀至少有 LCP`T-p`。 采取这两个位置至少给出一个候选指数

 [
 \frac{p+(T-p)}p=\frac Tp。 
]

 因此，最佳答案由一对后缀表示。 

对于固定 LCP 阈值`h`，当后缀数组等级之间的每个 LCP 边至少为`h`。 因此，该组件中的任何对至少具有 LCP`h`。 最小原位距离`d`在组件中给出了最大可能`(h+d)/d`在已知至少具有 LCP 的对中`h`。 

当最优对的实际 LCP 为`L`，扫描最终达到高度`L`。 此时该对属于一个组件，因此考虑其距离。 因此算法不会错过最优值。 它产生的每个候选都对应于一个实际的周期子串，因此它也不能产生无效的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1_000_000)

INF = 10**18

def suffix_array(s):
    n = len(s)

    # Append a unique sentinel smaller than every real character.
    a = [c - 96 for c in s] + [0]
    m = n + 1

    # Initial sorting by character using counting sort.
    alphabet = 27
    cnt = [0] * alphabet
    for x in a:
        cnt[x] += 1

    for i in range(1, alphabet):
        cnt[i] += cnt[i - 1]

    p = [0] * m
    for i in range(m - 1, -1, -1):
        x = a[i]
        cnt[x] -= 1
        p[cnt[x]] = i

    c = [0] * m
    classes = 1
    c[p[0]] = 0

    for i in range(1, m):
        if a[p[i]] != a[p[i - 1]]:
            classes += 1
        c[p[i]] = classes - 1

    k = 1

    while k < m and classes < m:
        # Shift every cyclic suffix by k.
        shifted = [0] * m
        for i in range(m):
            x = p[i] - k
            if x < 0:
                x += m
            shifted[i] = x

        # Counting-sort shifted positions by their class.
        cnt = [0] * classes
        for x in shifted:
            cnt[c[x]] += 1

        total = 0
        for i in range(classes):
            v = cnt[i]
            cnt[i] = total
            total += v

        new_p = [0] * m
        for x in shifted:
            cls = c[x]
            new_p[cnt[cls]] = x
            cnt[cls] += 1

        p = new_p

        new_c = [0] * m
        new_classes = 1
        new_c[p[0]] = 0

        for i in range(1, m):
            cur = p[i]
            prev = p[i - 1]

            cur_pair = (c[cur], c[(cur + k) % m])
            prev_pair = (c[prev], c[(prev + k) % m])

            if cur_pair != prev_pair:
                new_classes += 1

            new_c[cur] = new_classes - 1

        c = new_c
        classes = new_classes
        k <<= 1

    # The sentinel itself is first and is not a suffix of the original string.
    return p[1:]

def build_lcp(s, sa):
    n = len(s)
    rank = [0] * n

    for i, pos in enumerate(sa):
        rank[pos] = i

    height = [0] * n
    h = 0

    for i in range(n):
        r = rank[i]

        if r == 0:
            continue

        j = sa[r - 1]

        while i + h < n and j + h < n and s[i + h] == s[j + h]:
            h += 1

        height[r] = h

        if h:
            h -= 1

    return height

def solve(s):
    n = len(s)

    if n == 1:
        return "1/1"

    sa = suffix_array(s)
    height = build_lcp(s, sa)

    # Treap arrays. Node i represents original string position i.
    left = [0] * n
    right = [0] * n
    priority = [0] * n

    first = list(range(n))
    last = list(range(n))
    min_gap = [INF] * n

    # Deterministic 32-bit pseudo-random priorities.
    seed = 0x12345678
    for i in range(n):
        seed = (seed * 1664525 + 1013904223) & 0xffffffff
        priority[i] = seed

    def pull(t):
        l = left[t]
        r = right[t]

        if l:
            first[t] = first[l]
        else:
            first[t] = t

        if r:
            last[t] = last[r]
        else:
            last[t] = t

        g = INF

        if l:
            if min_gap[l] < g:
                g = min_gap[l]
            d = t - last[l]
            if d < g:
                g = d

        if r:
            if min_gap[r] < g:
                g = min_gap[r]
            d = first[r] - t
            if d < g:
                g = d

        min_gap[t] = g

    def split(t, key):
        # All keys in the first result are < key.
        # All keys in the second result are > key.
        # key itself is guaranteed not to occur in t.
        if not t:
            return 0, 0

        if key < t:
            a, b = split(left[t], key)
            left[t] = b
            pull(t)
            return a, t
        else:
            a, b = split(right[t], key)
            right[t] = a
            pull(t)
            return t, b

    def unite(a, b):
        if not a:
            return b
        if not b:
            return a

        if priority[a] < priority[b]:
            a, b = b, a

        bl, br = split(b, a)

        left[a] = unite(left[a], bl)
        right[a] = unite(right[a], br)

        pull(a)
        return a

    # DSU over suffix-array ranks.
    parent = list(range(n))
    treap_root = list(sa)

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def merge_components(a, b):
        a = find(a)
        b = find(b)

        if a == b:
            return a

        parent[b] = a
        treap_root[a] = unite(treap_root[a], treap_root[b])
        treap_root[b] = 0

        return a

    # Each positive height is an edge between ranks idx-1 and idx.
    edges = [i for i in range(1, n) if height[i] > 0]
    edges.sort(key=height.__getitem__, reverse=True)

    best_num = 1
    best_den = 1

    for idx in edges:
        h = height[idx]

        root = merge_components(idx - 1, idx)
        d = min_gap[treap_root[root]]

        # The component contains at least two suffixes here,
        # so d is finite and positive.
        num = h + d
        den = d

        if num * best_den > best_num * den:
            best_num = num
            best_den = den

    g = __import__("math").gcd(best_num, best_den)
    return f"{best_num // g}/{best_den // g}"

def main():
    s = input().strip().encode()
    sys.stdout.write(solve(s) + "\n")

if __name__ == "__main__":
    main()
```后缀数组例程首先附加一个由零表示的标记。 对循环移位进行排序`w + sentinel`相当于对后缀进行排序`w`，因为哨兵是唯一的并且比每个真实角色都要小。 前缀加倍然后替换长度前缀`k`按等价类并对长度前缀进行排序`2k`使用两个类值。 

LCP例程是Kasai算法。`rank[i]`给出从以下位置开始的后缀的后缀数组位置`i`。 当按字典顺序与前一个后缀进行比较时，前一个 LCP 值给出了新比较的下限，因此字符比较总数是线性的。 

陷阱的每个原始字符串位置都有一个节点。 节点的键就是它的索引，因此不需要单独的键数组。`first`,`last`， 和`min_gap`总结由子树表示的有序集。 最小间隙只能在左子树内部、右子树内部、当前键与左侧最大键之间、或者当前键与右侧最小键之间。`split`用钥匙分隔陷阱。 使用的密钥`unite`始终不存在于其他trap中，因为DSU组件包含不相交的后缀位置。`unite`保留具有较大随机优先级的根，并围绕该根的密钥拆分另一棵树。 这是标准的随机trap集合操作。 

DSU 按后缀数组排名索引，而不是按原始字符串位置索引。 这种区别是至关重要的。 被激活的边位于按字典顺序排列的相邻后缀之间，而指数公式中使用的距离位于它们原始起始位置之间。 

答案比较使用乘法而不是除法。 例如，要比较`7/3`和`2/1`，代码检查`7*1 > 2*3`。 Python 整数不会溢出，但使用精确整数运算也可以避免浮点比较可能引入的精度问题。 

该代码故意将答案初始化为`1/1`。 没有任何重复字符模式的字符串没有正 LCP 边缘，但其临界指数仍然是 1。 

## 工作示例

 ### 示例 1：`mississippi`使用从零开始的位置，后缀数组是`[10, 7, 4, 1, 0, 9, 8, 6, 3, 5, 2]`。 

对应的LCP数组为`[0, 1, 1, 4, 0, 0, 1, 0, 2, 1, 3]`。 

该算法按降序处理正高度。 

| 边缘索引| 高度`h`| 新合并的后缀位置 | 最短距离`d`| 候选人 | 迄今为止最好的 |
 | ---| ---| ---| ---| ---| ---|
 | 3 | 4 |`{4, 1}`| 3 |`7/3`|`7/3`|
 | 10 | 10 3 |`{5, 2}`| 3 |`6/3 = 2`|`7/3`|
 | 8 | 2 |`{6, 3}`| 3 |`5/3`|`7/3`|
 | 1 | 1 |`{10, 7}`| 3 |`4/3`|`7/3`|
 | 2 | 1 |`{10, 7, 4, 1}`| 3 |`4/3`|`7/3`|
 | 6 | 1 |`{9, 8}`| 1 |`2/1`|`7/3`|
 | 9 | 1 |`{6, 3, 5}`| 1 |`2/1`|`7/3`|

 在高处`4`，从位置开始的后缀`4`和`1`共享前缀`issi`。 他们的距离是`3`，所以子串从位置开始`1`有长度`4+3=7`和期间`3`。 这是`ississi`, 给出指数`7/3`。 

稍后合并包含位置`9`和`8`找到重复的子串`pp`, 给出指数`2`。 它是一个有效的候选者，但它没有击败`7/3`。 

### 示例 2：`abab`后缀的顺序为`ab`,`abab`,`b`,`bab`,

 所以后缀数组是`[2, 0, 3, 1]`。 LCP阵列是`[0, 2, 0, 1]`。 

| 边缘索引| 高度`h`| 新合并职位| 最短距离`d`| 候选人 | 迄今为止最好的 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 2 |`{2, 0}`| 2 |`4/2 = 2`|`2/1`|
 | 3 | 1 |`{3, 1}`| 2 |`3/2`|`2/1`|

 第一次合并使用位置`2`和`0`。 他们的后缀共享`ab`，所以距离是`2`结果子串的长度`4`。 这给出了精确的平方`abab`，其指数是`2`。 

第二次合并代表分数重复`bab`，其中有周期`2`和指数`3/2`。 它比整个正方形小。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 预期的`O(n log n)`| 前缀加倍后缀数组成本`O(n log n)`, 葛西成本`O(n)`，对LCP边成本进行排序`O(n log n)`，并且trap集并集预期`O(n log n)`总共 |
 | 空间|`O(n)`| 后缀数组数组、LCP 数据、DSU 数组以及每个字符串位置一个 Treap 节点 |

 输入最多包含`200000`字符，所以二次枚举已经太大，三次比较完全不可行。 该解决方案在后缀数组构造期间仅执行对数多次完整传递，并保持每个辅助结构在字符串长度上呈线性。 随机化处理避免了在 Python 中需要非标准有序集库。 

## 测试用例```
# Assume the submitted solution is saved as solution.py
from solution import solve

def run(inp: str) -> str:
    return solve(inp.strip().encode())

# Provided samples
assert run("mississippi") == "7/3", "sample 1"
assert run("abab") == "2/1", "sample 2"

# Minimum-size input
assert run("a") == "1/1", "single character"

# No repetition at all
assert run("abc") == "1/1", "all characters different"

# Fractional exponent
assert run("aba") == "3/2", "fractional repetition"

# Small repeated block, catches period and boundary handling
assert run("aab") == "2/1", "repeated pair at the beginning"

# All equal values
assert run("aaaaa") == "5/1", "all equal characters"

# Maximum-size input
assert run("a" * 200000) == "200000/1", "maximum-size all-equal string"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`a`|`1/1`| 最小输入和无边缘情况 |
 |`abc`|`1/1`| 没有重复模式的字符串 |
 |`aba`|`3/2`| 小数指数和部分末期 |
 |`aab`|`2/1`| 重复恰好在边界处结束 |
 |`aaaaa`|`5/1`| 最长可能的指数和许多相等的 LCP 值 |
 |`a * 200000`|`200000/1`| 最大输入大小和大整数答案 |

 ## 边缘情况

 对于单字符输入`a`，后缀数组仅包含一个后缀，LCP 数组仅包含零个。 不执行 DSU 合并。 最初的答案依然存在`1/1`，这正是唯一非空子串的指数。 

为了`abc`，每个正 LCP 值都不存在。 没有一对后缀具有共同的第一个字符，因此子字符串的句点不能小于其自身长度。 又是最初的`1/1`被保留。 假设至少有一个 LCP 正沿的解决方案在这里会失败。 

为了`aba`, 后缀从位置开始`0`和`2`有LCP`1`。 他们的距离是`2`，因此算法最终激活对应的LCP阈值，得到

 [
 \frac{1+2}{2}=\frac32。 
]

 对应的子串是`aba`。 这正是算法必须使用的原因`h+d`，而不仅仅是`2d`或仅完成重复块。 

为了`aab`，从位置开始的后缀`0`和`1`有LCP`1`。 他们的距离是`1`, 给予

 [
 \frac{1+1}{1}=2。 
]

 子串是`aa`。 这会捕获意外需要重复子字符串超出当前后缀或错误处理最终 LCP 位置的实现。 

为了`aaaaa`，每对后缀都有一个很长的公共前缀。 在最大有用LCP阈值处，最近的两个起始位置有距离`1`。 最终合并到达包含所有五个位置的组件，候选者是

 [
 \frac{4+1}{1}=5。 
]

 因此答案是`5/1`。 这种情况还说明了为什么有序结构必须有效地保持最小原始位置间隙，因为后缀数组组件可能会变得非常大。 

对于最大输入包括`200000`的副本`a`，同样的推理给出了周期`1`和长度`200000`，所以答案是`200000/1`。 分子直接作为整数处理，不存在浮点计算或固定宽度溢出问题。
