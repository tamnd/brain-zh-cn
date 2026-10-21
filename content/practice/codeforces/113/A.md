---
title: "CF 113A - 语法课"
description: "我们得到一行包含几个用空格分隔的小写单词。 Petya 语言中的每个有效单词都属于一个语法类别和一个性别，完全由其后缀决定。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 113
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 86 (Div. 1 Only)"
rating: 1600
weight: 113
solve_time_s: 281
verified: true
draft: false
---

[CF 113A - 语法课](https://codeforces.com/problemset/problem/113/A)

 **评分：** 1600
 **标签：** 实现、字符串
 **求解时间：** 4m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一行包含几个用空格分隔的小写单词。 Petya 语言中的每个有效单词都属于一个语法类别和一个性别，完全由其后缀决定。 

合法后缀只有六个：

 -`lios`用于男性形容词
 -`liala`用于女性形容词
 -`etr`用于阳性名词
 -`etra`用于阴性名词
 -`initis`对于阳性动词
 -`inites`对于阴性动词

 一个有效的句子具有非常严格的结构。 它可能包含：

 - 零个或多个形容词，
 - 后面紧跟着一个名词，
 - 后面跟着零个或多个动词。 

所有单词必须具有相同的性。 

任务是确定整个输入行是否恰好形成一个有效句子。 

总输入大小最多为$10^5$字符，因此解决方案必须在线性时间内处理字符串。 任何重复扫描前缀或重新计算同一单词分类的方法在实践中仍然可能通过，但除了从左到右的单次传递之外不需要任何其他方法。 一个干净的$O(n)$解决方案就足够了。 

棘手的部分不是性能，而是使语法验证完全正确。 

一个容易犯的错误是接受包含多个名词的输入。 一个句子必须恰好包含一个名词。 

例如：```
etr etr
```正确的输出是：```
NO
```仅检查后缀有效性和性别一致性的粗心实现会错误地接受它。 

另一个微妙的情况是订购。 形容词必须位于名词之前，动词必须位于名词之后。 

例子：```
initis etr
```正确的输出是：```
NO
```尽管这两个词都是阳性且单独有效，但动词出现在名词之前。 

混合性别也必须立即拒绝。 

例子：```
lios etra
```形容词是阳性，名词是阴性，所以答案是：```
NO
```最后一个边缘情况是，单个单词本身就是一个有效的句子，只要该单词属于该语言即可。 

例子：```
inites
```这是有效的，因为仅一个动词仍然符合语法：零个形容词，零个名词？ 不。一个陈述只需要一个名词，但问题还表明一个句子可能恰好是一个有效的语言单词。 自从`inites`是一个有效的词，答案是：```
YES
```这个特殊的规则很容易被忽视。 

## 方法

 最直接的暴力方法是对每个单词进行分类，然后尝试每个可能的位置作为名词。 对于每个候选名词位置，我们将验证所有前面的单词都是形容词，所有后面的单词都是动词，并且每个单词都具有相同的性别。 

如果有$n$换句话说，这需要检查$n$名词位置，每次检查可能会再次扫描整个句子。 总复杂度变为$O(n^2)$。 

和$10^5$字符，字数也可以很大。 如果输入包含许多短单词，则二次行为是不必要的，并且在 Python 中存在计时问题。 

关键的观察是语法定义了三个词性之间的严格顺序：```
adjective < noun < verb
```一个有效的句子必须恰好包含一个名词，并且类型的序列绝不能减少。 

一旦每个单词被分类为：

 - 性别，
 - 语法类型，

 问题变成了一个简单的线性扫描。 

我们从左到右处理单词，同时检查三个条件：

 - 每个单词都属于该语言，
 - 所有性别均匹配，
 - 语法类型以非递减顺序出现，并且只包含一个名词。 

这将问题减少到$O(n)$具有持续额外内存的时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 将输入行拆分为单词。 

每个单词都必须独立分析，因为它的后缀完全决定了它在语言中的作用。 
2. 对于每个单词，确定它是否与六个合法后缀之一匹配。 

如果没有后缀匹配，则整个句子立即无效。 
3. 将每个单词转换为两个属性：

 - 性别：男性或女性，
 - 类型：形容词、名词或动词。 

我们可以对类型进行数字编码：

 - 形容词= 0
 - 名词 = 1
 - 动词 = 2

 这使得订单检查变得非常简单。 
4. 如果句子恰好包含一个单词并且该单词有效，则打印`"YES"`。 

该问题明确允许单个有效单词成为一个完整的句子，无论它是否是名词。 
5. 否则，验证所有单词是否具有相同的性别。 

如果有一个单词不同，则打印`"NO"`。 
6. 计算出现了多少个名词。 

多词语句必须恰好包含一个名词。 
7. 从左到右扫描语法类型的顺序。 

类型绝不能减少。 换句话说：

 - 形容词后面可以跟形容词或名词，
 - 名词后面可以跟动词，
 - 动词后面只能跟动词。 

如果较小的类型出现在较大的类型之后，则语法顺序被破坏。 
8. 如果所有检查都通过，则打印`"YES"`。 

### 为什么它有效

 该语言中的每个有效语句都具有以下结构：```
(adjectives) noun (verbs)
```将形容词、名词和动词编码为`0`,`1`， 和`2`将语法规则转化为单调性条件。 一个有效的句子完全对应于包含一个名词的非递减序列。 

性别规则是独立且全局的，因此检查所有单词是否具有相同的性别就足够了。 

单个单词的异常是单独处理的，因为语法允许任何单独的有效单词形成句子，即使没有名词。 

由于这些检查之一可以检测到所有可能的无效性，因此该算法是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    words = input().split()

    suffixes = [
        ("lios", "M", 0),
        ("liala", "F", 0),
        ("etr", "M", 1),
        ("etra", "F", 1),
        ("initis", "M", 2),
        ("inites", "F", 2),
    ]

    parsed = []

    for word in words:
        found = False

        for suf, gender, typ in suffixes:
            if word.endswith(suf):
                parsed.append((gender, typ))
                found = True
                break

        if not found:
            print("NO")
            return

    if len(words) == 1:
        print("YES")
        return

    genders = [g for g, _ in parsed]
    types = [t for _, t in parsed]

    if len(set(genders)) != 1:
        print("NO")
        return

    if types.count(1) != 1:
        print("NO")
        return

    for i in range(1, len(types)):
        if types[i] < types[i - 1]:
            print("NO")
            return

    print("YES")

solve()
```实现的第一部分通过检查每个单词以哪个后缀结尾来对每个单词进行分类。 由于后缀列表很小且固定，因此一个简单的循环就足够了。 

这`parsed`数组存储对`(gender, type)`对于每个单词。 使用整数作为类型可以简化以后的排序检查。 

单词特殊情况必须出现在名词计数验证之前。 否则的话像`inites`或者`lios`会错误地失败，因为它们不是名词。 

性别检查使用一组。 如果存在不止一种不同的性别，则该句子无效。 

对于多字语句，名词计数必须恰好为 1。 这会捕获两个名词或没有名词之类的情况。 

最后，通过检查类型序列永不减少来验证排序条件。 这紧凑地强化了语法结构，而无需明确地将句子分成形容词、名词和动词片段。 

## 工作示例

 ### 示例 1

 输入：```
petr
```| 词| 后缀匹配| 性别 | 类型 |
 | ---| ---| ---| ---|
 | 彼得| 等等| 中号 | 名词|

 该句子仅包含一个有效单词，因此会自动接受。 

输出：```
YES
```此示例演示了单字规则。 尽管一般语句语法只需要一个由可选形容词和动词包围的名词，但该问题单独允许任何有效单词形成句子。 

### 示例 2

 输入：```
lios lios etr initis
```| 词| 后缀匹配| 性别 | 类型 |
 | ---| ---| ---| ---|
 | 利奥斯 | 利奥斯 | 中号 | 形容词|
 | 利奥斯 | 利奥斯 | 中号 | 形容词|
 | 等等| 等等| 中号 | 名词|
 | 伊尼蒂斯 | 伊尼蒂斯 | 中号 | 动词|

 提取的类型序列为：```
0 0 1 2
```该序列是非递减的并且只包含一个名词。 

输出：```
YES
```该迹证实了解的中心不变量。 有效的陈述对应于语法类别的非递减序列。 

### 示例 3

 输入：```
etr lios
```| 词| 后缀匹配| 性别 | 类型 |
 | ---| ---| ---| ---|
 | 等等| 等等| 中号 | 名词|
 | 利奥斯 | 利奥斯 | 中号 | 形容词|

 类型顺序为：```
1 0
```序列递减，意味着形容词出现在名词后面。 

输出：```
NO
```此示例说明了为什么仅检查性别和名词计数是不够的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个单词被分类一次 |
 | 空间| O(n) | 存储解析后的单词信息 |

 这里，$n$是句子中的单词数。 由于总输入长度最多为$10^5$，线性扫描很容易满足时间限制。 内存使用量也很小，因为我们每个单词只存储几个整数和字符串。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        words = input().split()

        suffixes = [
            ("lios", "M", 0),
            ("liala", "F", 0),
            ("etr", "M", 1),
            ("etra", "F", 1),
            ("initis", "M", 2),
            ("inites", "F", 2),
        ]

        parsed = []

        for word in words:
            found = False

            for suf, gender, typ in suffixes:
                if word.endswith(suf):
                    parsed.append((gender, typ))
                    found = True
                    break

            if not found:
                return "NO"

        if len(words) == 1:
            return "YES"

        genders = [g for g, _ in parsed]
        types = [t for _, t in parsed]

        if len(set(genders)) != 1:
            return "NO"

        if types.count(1) != 1:
            return "NO"

        for i in range(1, len(types)):
            if types[i] < types[i - 1]:
                return "NO"

        return "YES"

    return solve()

# provided sample
assert run("petr\n") == "YES", "sample 1"

# custom cases
assert run("inites\n") == "YES", "single valid non-noun word"

assert run("lios etr initis\n") == "YES", "valid full sentence"

assert run("etr etr\n") == "NO", "multiple nouns"

assert run("etr lios\n") == "NO", "wrong grammatical order"

assert run("lios etra\n") == "NO", "mixed genders"

assert run("abc\n") == "NO", "invalid suffix"

long_input = " ".join(["lios"] * 50000 + ["etr"]) + "\n"
assert run(long_input) == "YES", "large input stress test"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`inites`|`YES`| 单字异常 |
 |`lios etr initis`|`YES`| 有效的形容词-名词-动词结构 |
 |`etr etr`|`NO`| 只需要一个名词 |
 |`etr lios`|`NO`| 排序约束|
 |`lios etra`|`NO`| 性别一致性|
 |`abc`|`NO`| 无效的语言单词 |
 | 大重复形容词|`YES`| 线性性能|

 ## 边缘情况

 考虑输入：```
etr etr
```该算法将这两个单词分类为男性名词，生成类型序列：```
1 1
```由于序列是非递减的，因此排序条件通过。 关键的检查是名词计数。 由于有两个名词而不是一个，该算法正确打印：```
NO
```现在考虑：```
initis etr
```类型变为：```
2 1
```在从左到右扫描期间，算法检测到`1 < 2`，意味着序列减少。 这违反了所需的形容词-名词-动词顺序，所以答案是：```
NO
```对于混合性别：```
lios etra
```解析后的表示为：```
(M, adjective)
(F, noun)
```性别集包含两者`M`和`F`，因此该判决立即被拒绝。 

最后，检查特殊的单字情况：```
inites
```该词被认为是阴性动词。 通常，一个陈述需要一个名词，但该问题单独允许任何单个有效单词成为一个句子。 算法检查`len(words) == 1`在强制执行名词计数之前，产生正确的答案：```
YES
```
