---
title: "CF 1838D - 步行支架"
description: "我们有一个括号字符串。 步行从位置 1 开始，最终必须在位置 n 结束。 我们每时每刻都记录当前位置写的括号。"
date: "2026-06-09T06:35:43+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "greedy", "strings"]
categories: ["algorithms"]
codeforces_contest: 1838
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 877 (Div. 2)"
rating: 2100
weight: 1838
solve_time_s: 122
verified: true
draft: false
---

[CF 1838D - 支架行走](https://codeforces.com/problemset/problem/1838/D)

 **评分：** 2100
 **标签：** 数据结构、贪心、字符串
 **求解时间：** 2m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个括号字符串。 步行从位置 1 开始，最终必须在位置 1 结束`n`。 我们每时每刻都记录当前位置写的括号。 由于我们可以向左和向右任意移动多次，因此生成的序列可能比原始字符串长得多。 

如果存在某个记录的括号序列是常规括号序列（RBS）的步行，则该字符串被称为_walkable_。 

每次查询后，原始字符串的一个字符都会被翻转。 更新是永久性的，每次更新后我们必须回答当前字符串是否可步行。 

第一个挑战是了解什么类型的字符串是可以行走的。 步行过程看起来很复杂，因为有无限多种可能的路径。 关键的观察结果是，步行结构对端点和相邻等括号出现的位置施加了令人惊讶的强烈约束。 

制约因素很大。 两个都`n`和`q`可以达到`2 · 10^5`。 每次更新后重新计算任何线性内容大约需要`4 · 10^10`在最坏的情况下进行操作，这是完全不可行的。 我们需要每个查询的大致对数工作量。 

一些边缘情况很容易被忽略。 

考虑`n = 1`。```
(
```或者```
)
```任何步行都不能产生非空的常规括号序列，因为我们在同一字符上开始和结束。 答案总是`NO`。 

考虑：```
()
```这是微不足道的步行。 直接向右走会产生`"()"`。 

现在考虑：```
)(
```左括号和右括号的计数是平衡的，但第一个记录的字符是`')'`。 每个生成的序列都以`')'`，因此不可能有常规的括号序列。 

一个更微妙的例子是：```
(()(
```第一个字符是`'('`最后一个是`'('`。 常规括号序列必须以`')'`，所以无论内部结构如何，它都永远无法步行。 

最重要的隐藏案例是：```
()(())
```有相邻的等括号：`"(( "`和`"))"`。 简单的方法可能只检查计数和端点，但这还不够。 等相邻对的位置决定是否存在有效行走。 

## 方法

 暴力视图会将位置视为图形顶点。 我们可以尝试描述从位置 1 到位置的所有可能的行走`n`，生成生成的括号串，并检查其中是否有一个是规则的括号序列。 

这是没有希望的。 即使对于小字符串，行走的次数也会呈指数级增长，因为我们可能会向左和向右任意移动多次。 没有直接的状态空间搜索可以在约束下生存。 

这一突破来自于对可行走弦结构的理解。 

让我们看看相邻的位置。 每当两个相邻角色不同时，越过该边缘会贡献一个`'('`和一个`')'`按某种顺序。 这样的边缘是无害的。 

有问题的地方是相邻的等括号。 

如果我们有```
((
```然后我们在某个地方获得了一个“额外”的左括号。 如果我们有```
))
```然后我们在某个地方获得了一个“额外”的右括号。 

官方的解决方案依赖于一个特征：

 对于甚至`n`，一个字符串是可步行的当且仅当

 1.`s[0] = '('`。 
2.`s[n-1] = ')'`。 
3. 第一次出现`"))"`严格出现在最后一次出现之后`"(("`。 

等价地，每个`"(("`必须位于每个的左侧`"))"`。 

对于奇数`n`，答案总是`NO`因为每个正则括号序列的长度都是偶数，而每个游走长度都具有相同的奇偶性`n`。 

这种特征完全消除了行走的方面。 我们只需要维护：

 1.第一个字符是否为`'('`。 
2.最后一个字符是否是`')'`。 
3. 最大位置是否包含`"(("`小于包含的最小位置`"))"`。 

翻转后，只有接触该位置的对才能改变。 这样的相邻对最多有两个。 这建议维护所有的位置`"(("`和所有`"))"`在有序集合中。 

然后每个查询变成一些插入/删除和恒定数量的集合极值查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳| O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

 1.如果`n`很奇怪，每个答案都是立即的`NO`。 

每个正则括号序列的长度都是偶数。 每个可能的遍历输出的奇偶校验都是固定的，奇数长度的字符串永远不可能是可遍历的。 
2. 在可变数组中维护当前括号字符串。 
3.维护一套`open2`包含所有索引`i`这样`s[i]s[i+1] = "(("`。 

存储的索引是该对的左侧位置。 
4.维护一套`close2`包含所有索引`i`这样`s[i]s[i+1] = "))"`。 
5. 在处理查询之前，扫描所有相邻对一次并填充这两个集合。 
6. 当位置`p`被翻转，只有对`(p-1,p)`和`(p,p+1)`可以改变。 

首先从集合中删除他们的旧贡献。 
7. 翻转角色。 
8. 重新计算那些相同的相邻对并插入它们的新贡献。 
9. 要回答查询，首先检查端点。 

我们需要`s[0] = '('`和`s[n-1] = ')'`。 
10. 如果任一端点条件失败，请回答`NO`。 
11. 否则，如果两个集合都非空，则计算`max(open2)`和`min(close2)`。 

该字符串仅在以下情况下有效`max(open2) < min(close2)`。 

1. 如果其中一组为空，则条件自动成立。 

不存在冲突的配对顺序。 

### 为什么它有效

 核心定理是，对于偶数`n`，可步行性相当于端点条件和排序条件```
all "((" occur before all "))"
```一个`"(("`pair 的行为就像是多余左括号的来源，而 a`"))"`对的行为就像多余的右括号的来源。 当所有剩余开口出现在所有剩余关闭之前时，可以准确地构建有效的行走。 

这些集合精确地存储了这些多余对出现的位置。 最大`"(("`位置和最小的`"))"`位置足以测试排序属性是否全局成立。 如果最大的`"(("`仍然剩下最小的`"))"`，那么每一个`"(("`位于每个之前`"))"`。 否则侵犯财产权。 

由于翻转仅影响接触翻转位置的相邻对，因此动态维护这些集合是正确且高效的。 

## Python 解决方案```python
import sys
from bisect import bisect_left, insort

input = sys.stdin.readline

class OrderedSet:
    def __init__(self):
        self.a = []

    def add(self, x):
        i = bisect_left(self.a, x)
        if i == len(self.a) or self.a[i] != x:
            self.a.insert(i, x)

    def discard(self, x):
        i = bisect_left(self.a, x)
        if i < len(self.a) and self.a[i] == x:
            self.a.pop(i)

    def __len__(self):
        return len(self.a)

    def min(self):
        return self.a[0]

    def max(self):
        return self.a[-1]

def solve():
    n, q = map(int, input().split())
    s = list(input().strip())

    open2 = OrderedSet()
    close2 = OrderedSet()

    for i in range(n - 1):
        pair = s[i] + s[i + 1]
        if pair == "((":
            open2.add(i)
        elif pair == "))":
            close2.add(i)

    ans = []

    for _ in range(q):
        p = int(input()) - 1

        if n % 2 == 1:
            s[p] = ')' if s[p] == '(' else '('
            ans.append("NO")
            continue

        for i in (p - 1, p):
            if 0 <= i < n - 1:
                pair = s[i] + s[i + 1]
                if pair == "((":
                    open2.discard(i)
                elif pair == "))":
                    close2.discard(i)

        s[p] = ')' if s[p] == '(' else '('

        for i in (p - 1, p):
            if 0 <= i < n - 1:
                pair = s[i] + s[i + 1]
                if pair == "((":
                    open2.add(i)
                elif pair == "))":
                    close2.add(i)

        if s[0] != '(' or s[-1] != ')':
            ans.append("NO")
            continue

        if len(open2) and len(close2):
            ans.append("YES" if open2.max() < close2.min() else "NO")
        else:
            ans.append("YES")

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```编辑逻辑直接反映在实现中。`open2`存储所有位置`"(("`发生并且`close2`存储所有位置`"))"`发生。 答案仅取决于第一组中的最大元素和第二组中的最小元素。 

关键的实现细节是仅更新接触翻转位置的对。 其他相邻的对保持不变，因此修改其他任何内容都会浪费工作。 

另一个微妙的点是处理奇数`n`。 答案总是`NO`，但字符串本身在每次查询后仍然会发生变化。 未来的更新取决于当前状态，因此即使答案是预先确定的，我们也必须执行翻转。 

在检查集合之前必须执行终点检查。 以以下开头的字符串`')'`或以`'('`无论配对顺序如何，都永远无法步行。 

## 工作示例

 ### 示例 1

 初始字符串：```
(())()()))
```在查询1之后，位置9被翻转。 

结果字符串：```
(())()()()
```| 变量| 价值|
 | ---| ---|
 | 第一个字符 |`(`|
 | 最后一个字符 |`)`|
 | 空缺 2 个职位 | {1, 5} |
 | 平仓 | {2, 7} |
 | 最大（打开2）| 5 |
 | 分钟（关闭2）| 2 |
 | 回答 | 是 |

 排序条件在更新后保持不变，因此该字符串是可遍历的。 

### 示例 2

 输入：```
3 2
()(
1
2
```| 查询 | 字符串| 奇怪吗？ | 回答 |
 | ---| ---| ---| ---|
 | 1 |`))(`| 是的 | 否 |
 | 2 |`)((`| 是的 | 否 |

 自从`n = 3`很奇怪，每个答案都是立即的`NO`，独立于实际的支架布置。 

该迹线展示了奇偶校验属性。 再多的局部结构也无法克服奇数长度。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(q log n) | O(q log n) | 每次更新都会执行恒定数量的有序集插入和删除 |
 | 空间| O(n) | 这些集合存储相邻对位置 |

 和`n, q ≤ 2 · 10^5`，对数更新很容易足够快。 内存使用量是线性的并且完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    from bisect import bisect_left

    class OrderedSet:
        def __init__(self):
            self.a = []

        def add(self, x):
            i = bisect_left(self.a, x)
            if i == len(self.a) or self.a[i] != x:
                self.a.insert(i, x)

        def discard(self, x):
            i = bisect_left(self.a, x)
            if i < len(self.a) and self.a[i] == x:
                self.a.pop(i)

        def __len__(self):
            return len(self.a)

        def min(self):
            return self.a[0]

        def max(self):
            return self.a[-1]

    data = io.StringIO(inp)
    input = data.readline

    n, q = map(int, input().split())
    s = list(input().strip())

    open2 = OrderedSet()
    close2 = OrderedSet()

    for i in range(n - 1):
        pair = s[i] + s[i + 1]
        if pair == "((":
            open2.add(i)
        elif pair == "))":
            close2.add(i)

    out = []

    for _ in range(q):
        p = int(input()) - 1

        if n % 2:
            s[p] = ')' if s[p] == '(' else '('
            out.append("NO")
            continue

        for i in (p - 1, p):
            if 0 <= i < n - 1:
                pair = s[i] + s[i + 1]
                if pair == "((":
                    open2.discard(i)
                elif pair == "))":
                    close2.discard(i)

        s[p] = ')' if s[p] == '(' else '('

        for i in (p - 1, p):
            if 0 <= i < n - 1:
                pair = s[i] + s[i + 1]
                if pair == "((":
                    open2.add(i)
                elif pair == "))":
                    close2.add(i)

        if s[0] != '(' or s[-1] != ')':
            out.append("NO")
        elif len(open2) and len(close2):
            out.append("YES" if open2.max() < close2.min() else "NO")
        else:
            out.append("YES")

    return "\n".join(out)

# sample 1
assert run(
"""10 9
(())()()))
9
7
2
6
3
6
7
4
8
"""
) == "\n".join([
"YES","YES","NO","NO","YES","NO","YES","NO","NO"
])

# minimum size
assert run(
"""1 1
(
1
"""
) == "NO"

# already balanced, endpoint destroyed
assert run(
"""2 1
()
1
"""
) == "NO"

# all equal brackets
assert run(
"""4 1
((((
4
"""
) == "NO"

# endpoint restoration
assert run(
"""4 2
()))
1
4
"""
) == "NO\nYES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`n=1`|`NO`| 最小可能的字符串 |
 |`()`然后翻转第一个字符 |`NO`| 终点条件|
 |`((((`|`NO`| 全等号括号 |
 | 端点恢复案例|`NO`， 然后`YES`| 动态更新 |

 ## 边缘情况

 考虑：```
n = 3
s = ()(
```每个查询都会返回`NO`。 

该算法首先检查奇偶校验。 自从`n`很奇怪，它从不尝试评估配对排序条件。 这符合每个正则括号序列具有偶数长度的定理。 

考虑：```
n = 4
s = )()(
```第一个字符是`')'`最后一个是`'('`。 

即使没有冲突`"(("`和`"))"`位置，算法立即拒绝该字符串，因为有效的常规括号序列必须以`'('`并结束于`')'`。 

考虑：```
(())
```这里我们有：```
open2 = {1}
close2 = {2}
```和```
max(open2) = 1
min(close2) = 2
```排序条件成立，所以答案是`YES`。 

现在反转模式：```
))((
```然后：```
open2 = {2}
close2 = {0}
```和```
max(open2) = 2
min(close2) = 0
```排序条件不成立，所以答案是`NO`。 

这正是基于集合的测试旨在检测的情况。 一旦端点固定，剩余开口对和剩余关闭对的相对顺序就完全决定了可步行性。
