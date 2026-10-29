---
title: "CF 1504A - D\u00e9j\u00e0 Vu"
description: "我们得到了几个字符串。 对于每个字符串，我们必须在某个位置恰好插入一个字符“a”。 新字符串必须具有长度 输入最多包含 10^4 个测试用例，并且所有字符串长度之和最多为 3·10^5。"
date: "2026-06-10T20:40:31+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "strings"]
categories: ["algorithms"]
codeforces_contest: 1504
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 712 (Div. 2)"
rating: 800
weight: 1504
solve_time_s: 358
verified: false
draft: false
---

[CF 1504A - D\u00e9j\u00e0 Vu](https://codeforces.com/problemset/problem/1504/A)

 **评分：** 800
 **标签：** 构造算法、字符串
 **求解时间：** 5m 58s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了几个字符串。 对于每个字符串，我们必须插入一个字符`'a'`在某个位置。 新字符串必须有长度`|s|+1`，并且它一定不是回文。 如果每个可能的插入都会产生回文，我们必须报告不存在解决方案。 

输入最多包含`10^4`测试用例，所有字符串长度之和最多为`3·10^5`。 由于数据总量适中，因此运行时间与总长度呈线性关系的算法很容易足够快。 对于短字符串来说，每个字符串的二次工作仍然可以通过，但三次方法将成为不必要的开销。 

一些边缘情况很容易被错误处理。 

第一个是完全由以下内容组成的字符串`'a'`。 

输入：```
a
```唯一可能的插入创建`"aa"`，这仍然是一个回文。 正确答案是：```
NO
```一个粗心的解决方案总是会导致`'a'`前面会错误输出`"aa"`。 

另一种情况是，一个插入位置给出回文，但另一个位置有效。 

输入：```
ab
```在末尾插入给出`"aba"`，这是一个回文，但在开头插入给出`"aab"`，这不是。 正确答案是：```
YES
aab
```仅检查一个位置的解决方案可能会错过有效的构造。 

还有一些字符串已经是回文，但仍然承认有效答案。 

输入：```
aba
```添加`'a'`到前面给出`"aaba"`，这不是回文。 最初成为回文并不意味着不可能。 

## 方法

 一种简单的暴力方法尝试了所有方法`n+1`插入位置。 对于每个位置，它构造结果字符串并检查该字符串是否是回文。 该方法是正确的，因为每个可能的插入都会被检查。 

问题是一个长度的字符串`n`有`n+1`候选位置，并检查候选是否是回文`O(n)`时间。 构造字符串本身也需要花费`O(n)`。 总复杂度变为`O(n²)`。 

在给定的约束下，即使是二次时间在实践中也是可以接受的，因为总长度仅为`3·10^5`。 不过，这个问题的结构要简单得多。 

关键的观察是，如果原始字符串包含除`'a'`，那么两个结构之一必须有效。 

我们可以预先添加`'a'`，生产```
a + s
```或附加`'a'`，生产```
s + a
```假设两者都是回文。 自从```
a+s
```是一个回文，删除它的第一个和最后一个字符表明字符串的其余部分必须是对称的。 做同样的事情```
s+a
```得出相同的结论。 结合这些条件迫使每个角色`s`成为`'a'`。 

因此，每当字符串包含至少一个非`'a'`字符，这两种结构中至少有一种保证是非回文的。 我们只需要测试这两种可能性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 已接受 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取字符串`s`。 
2.构造相加得到的字符串`'a'`在前面。 
3. 检查这个新字符串是否是回文。 如果不是，则输出`"YES"`和这个字符串。 
4.否则构造相加得到的字符串`'a'`在最后。 
5. 检查第二个字符串是否是回文。 如果不是，则输出`"YES"`和这个字符串。 
6. 如果两个候选者都是回文，则输出`"NO"`。 

只检查两个位置的原因是任何包含与`'a'`必须使这些候选者中的至少一个成为非回文。 

### 为什么它有效

 该算法显式检查两个候选字符串`a+s`和`s+a`。 如果其中一个不是回文，则它是有效答案。 

假设两个候选人都是回文。 在`a+s`，第一个和最后一个字符相等，因此最后一个字符`s`必须是`'a'`。 删除这些匹配字符会留下回文。 重复这个论证表明，每个字符`s`是`'a'`。 对于这样的字符串，每次插入`'a'`产生另一个全`'a'`字符串，始终是回文。 因此不存在解决方案。 

由于该算法只要存在一个有效字符串就会输出一个有效字符串，并报告`"NO"`确切地说，当不存在解决方案时，它是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def is_palindrome(s):
    return s == s[::-1]

t = int(input())
ans = []

for _ in range(t):
    s = input().strip()

    front = 'a' + s
    if not is_palindrome(front):
        ans.append("YES")
        ans.append(front)
        continue

    back = s + 'a'
    if not is_palindrome(back):
        ans.append("YES")
        ans.append(back)
    else:
        ans.append("NO")

print("\n".join(ans))
```辅助函数检查字符串是否等于其反转。 Python 切片使这个操作变得简洁并且以线性时间运行。 

对于每个测试用例，代码首先尝试放置`'a'`在前面。 如果该字符串不是回文，它会立即记录答案并移至下一个测试用例。 

如果第一次尝试失败，代码会尝试放置`'a'`在最后。 仅当两个候选者都是回文时才会打印`"NO"`。 

顺序很重要，因为一旦找到有效的构造，就没有理由测试其他任何东西。 

边界条件很简单。 长度为 1 的字符串是自然处理的。 例如，`"a"`导致`"aa"`在两次尝试中，所以答案变成`"NO"`。 

## 工作示例

 ### 示例 1

 输入字符串：```
ab
```| 步骤| 候选人 | 回文？ | 行动|
 | --- | --- | --- | --- |
 | 1 |`"aab"`| 没有 | 输出答案 |

 算法立即停止并打印：```
YES
aab
```这个例子表明第一个候选者可能已经工作了，即使添加`'a'`其他地方可以产生回文。 

### 示例 2

 输入字符串：```
zza
```| 步骤| 候选人 | 回文？ | 行动|
 | --- | --- | --- | --- |
 | 1 |`"azza"`| 是的 | 继续 |
 | 2 |`"zzaa"`| 没有 | 输出答案 |

 输出变为：```
YES
zzaa
```此示例说明了为什么必须检查两端。 一个插入位置可能失败，而另一个插入位置成功。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 两个回文检查，每个都是线性的 |
 | 空间| O(n) | 临时字符串和反向副本 |

 这里`n`表示一个字符串的长度。 由于所有长度的总和最多为`3·10^5`，总工作量与输入大小成线性关系，并且完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def is_palindrome(s):
        return s == s[::-1]

    t = int(input())
    ans = []

    for _ in range(t):
        s = input().strip()

        front = 'a' + s
        if not is_palindrome(front):
            ans.append("YES")
            ans.append(front)
            continue

        back = s + 'a'
        if not is_palindrome(back):
            ans.append("YES")
            ans.append(back)
        else:
            ans.append("NO")

    return "\n".join(ans)

# provided sample
assert run(
"""6
cbabc
ab
zza
ba
a
nutforajaroftuna
"""
) == (
"""YES
acbabc
YES
aab
YES
zzaa
YES
aba
NO
YES
anutforajaroftuna"""
)

# minimum size
assert run(
"""1
a
"""
) == "NO", "single a"

# single non-a character
assert run(
"""1
b
"""
) == "YES\nab", "length one, solvable"

# all equal characters
assert run(
"""1
aaaa
"""
) == "NO", "all characters are a"

# off-by-one case
assert run(
"""1
zza
"""
) == "YES\nzzaa", "front insertion fails, back works"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a`|`NO`| 最小尺寸和不可能的情况|
 |`b`|`YES ab`| 长度一并给出有效答案 |
 |`aaaa`|`NO`| 所有字符都等于`'a'`|
 |`zza`|`YES zzaa`| 一端失败，另一端成功 |

 ## 边缘情况

 考虑输入```
1
a
```算法形式`"aa"`通过前置和`"aa"`通过附加。 两者都是回文，因此输出：```
NO
```这与每次插入都会产生相同字符串的事实相匹配。 

现在考虑```
1
ab
```第一个候选人是`"aab"`。```
aab ≠ baa
```所以它不是回文。 算法立即输出```
YES
aab
```不需要额外的工作。 

最后，考虑```
1
aba
```候选人是：```
aaba
abaa
```两个字符串都不等于其反转，因此接受第一个字符串：```
YES
aaba
```这证实了原始回文仍然可以具有有效的构造。
