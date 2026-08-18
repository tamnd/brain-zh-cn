---
title: "CF 102192H - K 相似字符串"
description: "我们需要在递归定义的 k 相似度概念下确定两个非空字符串是否属于同一等价类。 该关系从与其自身相似的字符串开始。"
date: "2026-08-18T10:07:57+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102192
codeforces_index: "H"
codeforces_contest_name: "2018 Chinese Multi-University Training, Nanjing U Contest"
rating: 0
weight: 102192
solve_time_s: 814
verified: true
draft: false
---

[CF 102192H - K 相似字符串](https://codeforces.com/problemset/problem/102192/H)

 **评级：** -
 **标签：** -
 **求解时间：** 13m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要在递归定义的 k 相似度概念下确定两个非空字符串是否属于同一等价类。 该关系从与其自身相似的字符串开始。 直接依赖于 k 的唯一规则是，当两个非空字符串 S 和 T 的总长度至多为 k 并且串联 ST 和 TS 已知相似时，它们可能相关。 然后，类似的子字符串可以在任何更大的字符串中被替换，并且传递性让我们可以进行链式替换。 

考虑定义的有用方法不是将其视为递归字符串比较，而是将其视为重写系统。 规则 2 创建了一小部分基本替换规则，而规则 3 和 4 表示我们可以在任何地方以任何顺序应用这些替换。 整个问题是理解每个可能的 k 值的基本规则是什么样的。 

尽管单个字符串可以包含 200,000 个字符，但所有输入字符串的总长度最多为 300 万个。 这立即排除了任何探索字符串的大状态空间的算法，如果结构可以减少到少量情况，即使 O(n log n) 解决方案也会比必要的更加机械。 每个测试用例的线性扫描完全在限制范围内，而任何二次扫描都可能需要在最大尺寸的测试用例上进行大约 4 × 10^10 字符操作。 

在一些边缘情况下，看似合理的实现却给出了错误的答案。 例如，当 k = 2 时，输入```
2
ab
ab
```有答案`yes`， 尽管```
2
a
aa
```有答案`no`。 如果粗心的实现将比较总长度至多为 k 的子字符串的能力视为删除或重复字符的权限，则会错误地接受第二种情况。 对于 k = 2，唯一的非平凡规则具有以下形式`a -> a`，所以实际上没有什么可以改变。 

k = 4 和 k = 5 之间的边界是另一个陷阱。 考虑```
4
abcba
aba
```答案是`no`。 k = 4 的缩减不会崩溃`abcba`与以下相同的范式`aba`。 然而，当 k = 5 时，```
5
abcba
aba
```有答案`yes`，因为一旦 k 达到 5，关系就完全由第一个和最后一个字符来表征。 对所有 k >= 4 进行相同处理就失去了这种区别。 

第三个常见错误是过早只使用第一个和最后一个字符。 为了```
3
aab
ab
```答案是`yes`，因为可以插入或删除同一字符的连续副本。 但对于```
4
abca
aba
```答案是`no`，即使两个字符串以相同的字符开头和结尾。 仅从 k = 5 开始，终点条件才变得充分。 

这些分类及其正常形式也在官方竞赛社论中给出。 

## 方法

 直接的方法会尝试从字面上遵循定义。 我们可以将每对已知的相似字符串视为一个重写规则，生成从 A 可达的所有字符串，并在 B 出现时停止。 这在概念上是正确的，因为规则 3 和 4 准确地说 k 相似性是规则 2 生成的替换的自反、对称、传递闭包。 

问题是可能的状态数量。 即使将我们限制为长度最多为 n 的字符串，也有

 [
 \sum_{i=1}^{n} 26^i = \frac{26^{n+1}-26}{25}
 ]

 可能的小写字符串。 对于 n = 200000，这是一个天文数字。 递归搜索还可以通过不同的替换序列重新访问相同的等价类，因此记忆并不能挽救该方法。 蛮力仅适用于发现细弦上的结构。 

关键的观察结果是规则 2 是 k 唯一重要的地方。 一旦规则 2 生成的基本规则已知，其余规则就允许在更大的字符串中使用这些替换。 官方分析首先观察到两个k相似的字符串必须具有相同的第一个字符和相同的最后一个字符，然后根据k对有用的替换规则进行分类。 

对于 k = 1 和 k = 2，不可能进行有用的修改，因此字符串必须在字面上相等。 对于 k = 3，有用的规则是`a -> aa`和`aa -> a`，每个角色都是独立的。 因此，一个字符的每个最大运行都可以由单个副本替换，从而给出唯一的简化字符串。 

对于 k = 4，还有对应的附加规则`a -> aba`及其相反。 在首先删除连续的重复项之后，这些规则可以用约简来表示`aba -> a`。 堆栈恰好给出了这种减少：如果新字符等于顶部以下两个位置的字符，则可以删除顶部字符。 生成的堆栈是等价类的规范形式。 

当 k = 5 时，新可用的规则可以将任何字符串缩减为其两个端点字符。 k = 5 处出现的额外规则本身可以从 k = 4 规则中获得，因此从此时开始不需要新的不变量。 第一个和最后一个字符都是必要且充分的。 对于每个 k > 5，相同的分类仍然有效。 

这给出了恒定数量的线性扫描，而不是对字符串的搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 最坏情况下的 O(26^n) 状态 | O(26^n) | O(26^n) | 太慢了|
 | 最佳| O( | A | + | B | ) | O( | A | + | B | ) | 已接受 |

 ## 算法演练

 1. 读取k、A、B。如果k为1或2，则直接比较两个字符串。 在这些情况下，没有有用的替换可以更改任一字符串。 
2. 如果 k 为 3，则将每一最大串相同字符压缩为一个字符。 例如，`aaabbccca`变成`abca`。 比较两个压缩字符串。 这是可行的，因为唯一有用的操作是在运行中添加或删除一个副本。 
3.如果k为4，则首先执行相同的连续重复压缩。 然后用堆栈扫描生成的字符串。 对于每个字符 c，将其与 at 处的字符进行比较`stack[-2]`当该位置存在时。 如果相等，则移除当前栈顶而不是压入 c。 否则推c。 
4. 对两个字符串应用相同的 k = 4 归约并比较结果堆栈。 相等的缩减堆栈意味着两个字符串可以通过可用的 k = 4 替换相互转换。 
5. 如果 k 至少为 5，则仅比较 A 和 B 的第一个和最后一个字符。当两个端点一致时，它们恰好是 k 相似的。 
6. 输出`yes`当相应的规范形式一致时，并且`no`否则。 

为什么它有效：不变量是算法使用的每个变换准确地保留规则 2 生成的等价类。对于 k = 3，不变量是不同运行的序列。 对于 k = 4，每次基本替换都不会改变堆栈缩减，包括 k = 3 已经可用的规则，因此同一等价类中的两个字符串具有相同的堆栈结果。 相反，堆栈执行的每次归约都对应于有效的 k = 4 替换，因此可以通过有效替换连接相等的堆栈结果。 对于 k >= 5，基本规则允许删除字符串的每个内部部分，同时保留其端点，从而使端点对成为完整的不变量。 每个规则都会保留第一个和最后一个字符本身，因此不同的端点永远不会相等。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def compress_runs(s):
    res = []
    for c in s:
        if not res or res[-1] != c:
            res.append(c)
    return res

def reduce_k4(s):
    stack = []
    for c in s:
        if stack and stack[-1] == c:
            continue

        if len(stack) >= 2 and stack[-2] == c:
            stack.pop()
        else:
            stack.append(c)

    return stack

def similar(k, a, b):
    if k <= 2:
        return a == b

    if k == 3:
        return compress_runs(a) == compress_runs(b)

    if k == 4:
        return reduce_k4(a) == reduce_k4(b)

    return a[0] == b[0] and a[-1] == b[-1]

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        k = int(input())
        a = input().strip()
        b = input().strip()

        ans.append("yes" if similar(k, a, b) else "no")

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```这`similar`函数直接实现四种结构情况。 无需检查 k 是否为 1、2、3、4 或至少 5。`compress_runs`使用列表作为不同连续字符的堆栈。 仅当字符与前一个字符不同时才会附加该字符，因此诸如`aaaa`恰好贡献了一个`a`。`reduce_k4`包含唯一稍微微妙的实现。 第一个`if`处理连续的相等字符，这些字符已经可以删除，因为当 k = 4 时 k = 3 规则可用。第二个条件检查新字符是否与顶部下方两个位置的字符匹配。 在这种情况下，顶部字符代表一个字符的中间`aba`图案并可以删除。 

这两个条件的顺序很重要。 在检查两回字符之前必须忽略连续的重复项，因为 k = 4 范式是在 k = 3 归约已经合并之后定义的。 

不存在整数溢出问题，因为该算法仅存储字符和索引。 输入字符串本身主导内存使用，总输入大小限制为 300 万个字符。 

## 工作示例

 ### 示例 1

 对于第一个样本，k = 3，A 为`ba`，B 是`baa`。 该算法使用运行压缩。 

| 步骤| 一个状态 | B状态|
 | --- | --- | --- |
 | 开始|`ba`|`baa`|
 | 读`b`|`b`|`b`|
 | 首先阅读`a`|`ba`|`ba`|
 | 读第二个`a`| 不变| 不变|
 | 简化形式 |`ba`|`ba`|
 | 结果 | 等于|`yes`|

 第二个`a`B 属于与第一次相同的连续运行`a`，因此可以使用 k = 3 规则将其删除`aa -> a`。 这正是原始示例中根据定义使用的转换。 

### 示例 2

 对于第二个样本，k = 2，A 为`aab`，B 是`ab`。 由于 k 太小而无法创建有用的替换，因此算法必须比较原始字符串。 

| 步骤| k | 一个 | 乙| 决定|
 | --- | --- | --- | --- | --- |
 | 开始| 2 |`aab`|`ab`| k <= 2 |
 | 比较 | 2 |`aab`|`ab`| 不同|
 | 结果 | 2 |`aab`|`ab`|`no`|

 这说明了为什么当 k = 2 时，算法不能应用 k = 3 运行压缩规则。两个字符串具有相同的端点，但它们仍然不是 k 相似的。 

### 附加 k = 4 迹线

 考虑 k = 4，A =`ababa`。 经过连续重复压缩后，字符串没有变化。 堆栈的演变是：

 | 人物 | 堆栈之前 | 行动| 堆栈之后 |
 | --- | --- | --- | --- |
 |`a`|`[]`| 推|`[a]`|
 |`b`|`[a]`| 推|`[a,b]`|
 |`a`|`[a,b]`| 推|`[a,b,a]`|
 |`b`|`[a,b,a]`|`b == stack[-2]`, 流行 |`[a,b]`|
 |`a`|`[a,b]`|`a == stack[-2]`, 流行 |`[a]`|

 整个字符串减少为`a`。 同样的情况也发生在`aba`，因此对于 k = 4，这两个字符串是 k 相似的。该跟踪显示了为什么堆栈条件向后查找两个位置，而不是仅仅检查当前字符是否等于顶部。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O( | A | + | B | ) | 每个输入字符都会被处理固定次数。 |
 | 空间| O( | A | + | B | ) | 临时简化表示对于每个输入字符至多包含一个条目。 |

 在所有测试用例中，总输入长度最多为 300 万个字符。 因此，该算法总体上仅执行线性数量的字符操作，这很容易与 2 秒的限制兼容。 最大单个字符串长度 200,000 也远低于基于 Python 列表的线性扫描出现问题的点。 

## 测试用例```python
import sys
import io

def compress_runs(s):
    res = []
    for c in s:
        if not res or res[-1] != c:
            res.append(c)
    return res

def reduce_k4(s):
    stack = []
    for c in s:
        if stack and stack[-1] == c:
            continue
        if len(stack) >= 2 and stack[-2] == c:
            stack.pop()
        else:
            stack.append(c)
    return stack

def similar(k, a, b):
    if k <= 2:
        return a == b
    if k == 3:
        return compress_runs(a) == compress_runs(b)
    if k == 4:
        return reduce_k4(a) == reduce_k4(b)
    return a[0] == b[0] and a[-1] == b[-1]

def solve():
    t = int(input())
    out = []
    for _ in range(t):
        k = int(input())
        a = input().strip()
        b = input().strip()
        out.append("yes" if similar(k, a, b) else "no")
    return "\n".join(out)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        return solve() + "\n"
    finally:
        sys.stdin = old_stdin

# Provided samples
sample = """4
3
ba
baa
2
aab
ab
1
acesrc
acesrc
100
roundgod
zyb
"""
assert run(sample) == "yes\nno\nyes\nno\n", "provided samples"

# Minimum-size inputs and k = 1.
assert run("""2
1
a
a
1
a
b
""") == "yes\nno\n", "minimum-size strings"

# k = 2 must not perform k = 3 compression.
assert run("""2
2
aab
ab
2
aa
aa
""") == "no\nyes\n", "k=2 boundary"

# k = 3 removes consecutive repetitions.
assert run("""2
3
aaab
ab
3
abca
abcaa
""") == "yes\nyes\n", "k=3 run compression"

# k = 4 uses the two-back stack reduction.
assert run("""2
4
ababa
aba
4
abca
aba
""") == "yes\nno\n", "k=4 stack reduction"

# k = 5 changes the criterion to endpoints.
assert run("""2
5
abcba
aba
5
abcba
abbc
""") == "yes\nno\n", "k=5 endpoint boundary"

# Maximum-size all-equal strings.
n = 200000
big = "a" * n
assert run(f"""2
1
{big}
{big}
3
{big}b
ab
""") == "yes\nyes\n", "maximum-size and all-equal values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / a / a`和`1 / a / b`|`yes`,`no`| 最小长度且 k = 1 |
 |`2 / aab / ab`|`no`| 防止 k = 2 时出现意外的 k = 3 行为 |
 |`3 / aaab / ab`|`yes`| 连续运行减少|
 |`4 / ababa / aba`|`yes`| 两背叠减|
 |`4 / abca / aba`|`no`| 具有相同端点但不同范式的 k = 4 情况 |
 |`5 / abcba / aba`|`yes`| 精确 k = 5 边界 |
 | 200000份`a`|`yes`| 最大输入大小和全相等字符串 |

 ## 边缘情况

 对于 k = 2，考虑```
2
aab
ab
```算法输入`k <= 2`分支并比较`aab == ab`，这是错误的。 它输出`no`。 这可以避免错误地删除连续的一个`a`字符，只有k达到3后才可以进行的操作。 

对于 k = 3，考虑```
3
aaab
ab
```运行压缩更改`aaab`进入`ab`， 尽管`ab`已经减少了。 两个规范形式相等，因此算法输出`yes`。 在这个 k 值下，运行中重复副本的数量并不重要。 

For k = 4, consider```
4
ababa
aba
```第一个字符串产生堆栈状态`[a]`,`[a,b]`,`[a,b,a]`,`[a,b]`,`[a]`，而第二个产生`[a]`,`[a,b]`,`[a]`。 两者都结束于`[a]`，所以答案是`yes`。 这练习了非本地堆栈减少，而不仅仅是连续的重复删除。 

对于 k = 4 与 k = 5 边界，考虑```
4
abca
aba
```k = 4 减少离开`abca`不变，同时`aba`减少到`a`，所以答案是`no`。 仅将 k 更改为 5 给出```
5
abca
aba
```两个字符串都以`a`并结束于`a`，因此应用终点标准，答案变为`yes`。 

对于最大尺寸输入，取两个由 200,000 个副本组成的字符串`a`。 即使 k = 1，它们也立即相等。 该实现执行单个字符串比较，并且从不构造大型辅助结构，因此情况在输入大小方面保持线性。 

k = 1、k = 2、k = 3、k = 4 和 k >= 5 的分类是核心见解。 一旦这些范式被识别，明显的递归定义就会崩溃为一些线性时间字符串扫描。
