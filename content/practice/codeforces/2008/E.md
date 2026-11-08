---
title: "CF 2008E - 交替弦"
description: "我们得到一串小写字母。 交替字符串具有非常特定的形式。 偶数索引处的所有字符必须相同，奇数索引处的所有字符必须相同，并且最终长度必须为偶数。"
date: "2026-06-08T13:26:54+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "dp", "greedy", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 2008
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 970 (Div. 3)"
rating: 1500
weight: 2008
solve_time_s: 124
verified: true
draft: false
---

[CF 2008E - 交替字符串](https://codeforces.com/problemset/problem/2008/E)

 **评分：** 1500
 **标签：** 暴力破解、数据结构、dp、贪心、实现、字符串
 **求解时间：** 2m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一串小写字母。 交替字符串具有非常特定的形式。 

偶数索引处的所有字符必须相同，奇数索引处的所有字符必须相同，并且最终长度必须为偶数。 

两个奇偶校验组可以使用相同的字母或不同的字母。 例如，`"aaaa"`是交替的，因为每个偶数位置都包含`'a'`并且每个奇数位置还包含`'a'`。 

我们可以执行任意数量的替换，将字符更改为任何其他字母。 另外，我们最多可以从字符串中删除一个字符。 目标是尽量减少操作总数。 

输入最多包含$10^4$测试用例，所有字符串长度之和最多为$2 \cdot 10^5$。 这个总界限是真正的约束。 任何与测试用例长度成二次方的解决方案在长度字符串上都会变得太慢$2 \cdot 10^5$。 我们周围需要一些东西$O(n \cdot 26)$或者$O(n \log n)$每个测试用例，因为字母表大小只有 26。 

一些边缘情况很容易被错误处理。 

考虑一个单字符字符串：```
1
a
```答案是1。我们必须删除唯一的字符，产生空字符串，这是一个偶数长度的交替字符串。 假设最终字符串必须非空的解决方案将会失败。 

考虑：```
3
abc
```长度是奇数。 必须删除一项，因为最终长度必须是偶数。 仅计算替换而不考虑删除的解决方案将错误地返回 2，而正确答案是 1。 

另一个微妙的情况是：```
5
ababa
```删除第一个字符给出`"baba"`，这已经是交替的了。 答案是1。总是删除导致最多不匹配的字符的贪婪策略很容易错过这一点。 

最难的陷阱来自于删除后奇偶校验的变化。 在```
5
aabaa
```删除中间的字符会更改其右侧每个字符的奇偶校验。 独立处理左右部分而不考虑这种偏移会产生不正确的频率计数。 

## 方法

 让我们首先想象一下暴力解决方案。 

如果长度是偶数，则目标字符串必须具有相同的长度。 我们为偶数位置选择一个字母，为奇数位置选择一个字母。 只有$26^2 = 676$的可能性。 对于每一对，我们计算有多少个位置已经匹配以及需要多少个替换。 

如果长度是奇数，则必须恰好发生一个删除。 我们可以尝试每个删除位置。 删除一个字符后，我们再次尝试所有 676 个奇偶校验字母对并计算替换成本。 

蛮力的想法是完全正确的。 困难在于速度。 对于一个长度的字符串$n$，尝试所有删除位置并每次扫描整个字符串的成本$O(n^2)$。 和$n = 2 \cdot 10^5$，这是没有希望的。 

关键的观察是交替字符串只关心奇偶校验类。 对于偶数长度的字符串，一旦我们选择偶数位置使用的字母和奇数位置使用的字母，每个位置就变得独立。 

假设字符串长度已经是偶数。 让：

-`even[c]`是字母出现的次数`c`在偶数位置上。 
-`odd[c]`是字母出现的次数`c`在奇数位置。 

如果我们选择字母`x`对于偶数位置和字母`y`对于奇数位置，则已经正确的位置数为：$$even[x] + odd[y]$$为了最大限度地保留字符，我们只需选择偶数位置上最常见的字母和奇数位置上最常见的字母。 最少的替换变为：$$n - \max(even) - \max(odd)$$奇数长度的情况更有趣。 

删除位置后$i$, 之前的字符$i$保持奇偶性，而后面的字符$i$切换奇偶校验，因为所有内容都会左移一位。 

这表明维持删除点两侧的频率计数。 

让：

-`pref_even`,`pref_odd`计算删除前的字母数。 
-`suf_even`,`suf_odd`从当前位置开始计算字母数。 

当我们删除位置时$i$：

 - 之前的字符$i$正常贡献；
 - 之后的字符$i$交换奇偶校验类。 

对于每个字母，我们可以计算删除后它在新的偶数位置和新的奇数位置中出现的次数。 

然后，最佳交替目标再次保留每个奇偶类别中最常见的字母。 

由于字母表大小只有26个，评估一个删除位置的成本$O(26)$。 扫描所有仓位费用$O(26n)$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2 \cdot 26^2)$|$O(1)$| 太慢了|
 | 最佳 |$O(n \cdot 26)$|$O(26)$| 已接受 |

 ## 算法演练

 ### 偶数长度字符串

 1. 计算偶数位置上每个字母出现的频率。 
2. 计算每个字母出现在奇数位置的频率。 
3. 选择最常见的偶数位置字母和最常见的奇数位置字母。 
4. 保留的字符数等于这两个最大值的总和。 
5.答案是`n - preserved`。 

目标交替字符串完全由每个奇偶校验类别的一个字母确定，因此为每个奇偶校验独立地最大化保留的字符是最佳的。 

### 奇数长度字符串

 1. 建立频数表`suf_even`和`suf_odd`对于整个字符串。 
2.初始化空前缀表`pref_even`和`pref_odd`。 
3. 迭代每个位置`i`作为删除候选者。 
4. 删除`s[i]`从适当的后缀表中删除，因为该字符将被删除。 
5. 对于每一个字母`c`，计算其在结果偶数位置的频率：$$pref\_even[c] + suf\_odd[c]$$删除后的字符切换奇偶校验。 

1. 对于每个字母`c`，计算其在结果奇数位置的频率：$$pref\_odd[c] + suf\_even[c]$$1. 让`best_even`和`best_odd`是这些数组中的最大值。 
2. 得到的字符串长度为`n - 1`。 需要更换的数量为：$$(n-1) - best\_even - best\_odd$$1. 为删除本身添加一项操作。 
2. 在所有删除位置上保留最小答案。 
3. 移动`s[i]`进入适当的前缀表并继续。 

### 为什么它有效

 对于任何固定的删除位置，每个剩余字符都属于结果字符串的偶数或奇数奇偶校验类别。 交替字符串只需要为每个类别选择一个字母。 最佳选择始终是该类中最常见的字母，因为必须替换所有其他出现的字母。 

前缀/后缀分解计算删除后的确切奇偶校验类。 删除前的字符保持奇偶校验，删除后的字符交换奇偶校验。 每个剩余的字符在其新类别中只计算一次。 由于检查了每个删除位置，因此所有位置的最小值是全局最优值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    for _ in range(t):
        n = int(input())
        s = input().strip()

        if n % 2 == 0:
            even = [0] * 26
            odd = [0] * 26

            for i, ch in enumerate(s):
                idx = ord(ch) - 97
                if i % 2 == 0:
                    even[idx] += 1
                else:
                    odd[idx] += 1

            ans = n - max(even) - max(odd)
            print(ans)
            continue

        suf_even = [0] * 26
        suf_odd = [0] * 26

        for i, ch in enumerate(s):
            idx = ord(ch) - 97
            if i % 2 == 0:
                suf_even[idx] += 1
            else:
                suf_odd[idx] += 1

        pref_even = [0] * 26
        pref_odd = [0] * 26

        ans = n

        for i, ch in enumerate(s):
            idx = ord(ch) - 97

            if i % 2 == 0:
                suf_even[idx] -= 1
            else:
                suf_odd[idx] -= 1

            best_even = 0
            best_odd = 0

            for c in range(26):
                best_even = max(
                    best_even,
                    pref_even[c] + suf_odd[c]
                )
                best_odd = max(
                    best_odd,
                    pref_odd[c] + suf_even[c]
                )

            replacements = (n - 1) - best_even - best_odd
            ans = min(ans, replacements + 1)

            if i % 2 == 0:
                pref_even[idx] += 1
            else:
                pref_odd[idx] += 1

        print(ans)

solve()
```偶数长度分支很简单。 我们分别计算两个奇偶类别的频率，并保留每个奇偶类别中最常见的字母。 

奇数长度分支维护四个频率阵列。 后缀数组最初包含整个字符串的计数。 当我们从左到右扫描时，当前字符将从后缀侧删除，因为它被视为已删除。 

公式```
pref_even[c] + suf_odd[c]
pref_odd[c] + suf_even[c]
```删除后对奇偶校验交换进行编码。 这是该解决方案的核心细节。 忘记交换是最常见的错误。 

删除位置的答案由两部分组成。 首先，我们计算结果字符串中所需的替换长度`n - 1`。 然后我们为删除本身添加一项操作。 

## 工作示例

 ### 示例 1

 输入：```
5
ababa
```| 我| 已删除 | 最佳偶数 | 最佳奇数 | 替代品 | 总计 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 一个 | 2 | 2 | 0 | 1 |
 | 1 | 乙| 2 | 1 | 1 | 2 |
 | 2 | 一个 | 2 | 2 | 0 | 1 |
 | 3 | 乙| 2 | 1 | 1 | 2 |
 | 4 | 一个 | 2 | 2 | 0 | 1 |

 最小总数为 1。删除任何`'a'`立即留下一个交替的字符串。 

### 示例 2

 输入：```
6
acdada
```甚至职位包含：```
a d d
```奇数位置包含：```
c a a
```| 平价| 频率 | 最大|
 | --- | --- | --- |
 | 甚至| a：1，d：2 | 2 |
 | 奇数| 甲：2，丙：1 | 2 |

 保留的字符数为：$$2 + 2 = 4$$答案是：$$6 - 4 = 2$$更换两次就足够了，与样品相匹配。 

这个例子表明，当长度已经是偶数时，删除永远没有用，因为删除会使长度成为奇数并违反定义。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \cdot 26)$| 每个位置处理一次，奇数长度情况评估 26 个字母 |
 | 空间|$O(26)$| 仅存储恒定大小的频率数组 |

 由于所有测试用例的总长度最多为$2 \cdot 10^5$，该算法的执行大致为$26 \cdot 2 \cdot 10^5$基本操作，很容易在时间限制内完成。 内存使用量是恒定的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline
    out = []

    t = int(input())

    for _ in range(t):
        n = int(input())
        s = input().strip()

        if n % 2 == 0:
            even = [0] * 26
            odd = [0] * 26

            for i, ch in enumerate(s):
                idx = ord(ch) - 97
                if i % 2 == 0:
                    even[idx] += 1
                else:
                    odd[idx] += 1

            out.append(str(n - max(even) - max(odd)))
            continue

        suf_even = [0] * 26
        suf_odd = [0] * 26

        for i, ch in enumerate(s):
            idx = ord(ch) - 97
            if i % 2 == 0:
                suf_even[idx] += 1
            else:
                suf_odd[idx] += 1

        pref_even = [0] * 26
        pref_odd = [0] * 26

        ans = n

        for i, ch in enumerate(s):
            idx = ord(ch) - 97

            if i % 2 == 0:
                suf_even[idx] -= 1
            else:
                suf_odd[idx] -= 1

            be = 0
            bo = 0

            for c in range(26):
                be = max(be, pref_even[c] + suf_odd[c])
                bo = max(bo, pref_odd[c] + suf_even[c])

            ans = min(ans, (n - 1) - be - bo + 1)

            if i % 2 == 0:
                pref_even[idx] += 1
            else:
                pref_odd[idx] += 1

        out.append(str(ans))

    return "\n".join(out)

# provided sample
assert run("""10
1
a
2
ca
3
aab
5
ababa
6
acdada
9
ejibmyyju
6
bbccbc
6
abacba
5
bcbca
5
dcbdb
""") == """1
0
1
1
2
6
2
3
1
1"""

# minimum size
assert run("""1
1
a
""") == "1"

# already alternating even length
assert run("""1
4
abab
""") == "0"

# all equal odd length
assert run("""1
5
aaaaa
""") == "1"

# parity shift after deletion
assert run("""1
5
ababa
""") == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`n=1, "a"`|`1`| 删除后空字符串 |
 |`n=4, "abab"`|`0`| 已经交替 |
 |`n=5, "aaaaa"`|`1`| 只删除，不替换 |
 |`n=5, "ababa"`|`1`| 正确处理奇偶校验移位 |

 ## 边缘情况

 考虑：```
1
a
```字符串长度为奇数。 删除唯一的字符会留下长度为 0 的字符串。在扫描期间，唯一的删除候选会产生`best_even = best_odd = 0`。 替换成本为0，加上删除操作给出1。算法正确返回1。 

考虑：```
3
abc
```删除任何字符都会生成长度为 2 的字符串。该算法会评估所有三个删除位置并计算奇偶校验移位后的最佳奇偶校验频率。 总成本最小为1，通过删除实现`'b'`获得`"ac"`，这已经是交替的了。 

考虑：```
5
ababa
```删除索引 0 时，所有剩余字符都会移位奇偶校验。 公式$$pref\_even + suf\_odd$$正确地将右侧移动到相反的奇偶校验类别。 结果计数显示所有剩余的四个字符都已与交替模式匹配，给出答案 1。 

考虑：```
5
aabaa
```删除中间的字符会导致右侧的每个字符交换奇偶校验。 忽略这种转变的简单频率计算会计算错误类别中的字母并高估替换数量。 前缀/后缀公式明确地执行交换并产生正确的最小成本。
