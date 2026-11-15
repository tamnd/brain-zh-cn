---
title: "CF 53A - 自动完成"
description: "我们被要求实现一个简化的自动完成功能。 输入由字符串 s 组成，它表示用户到目前为止输入的文本，后跟之前访问过的页面的列表。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 53
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 49 (Div. 2)"
rating: 1100
weight: 53
solve_time_s: 208
verified: true
draft: false
---

[CF 53A - 自动完成](https://codeforces.com/problemset/problem/53/A)

 **评分：** 1100
 **标签：** 实施
 **求解时间：** 3m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求实现一个简化的自动完成功能。 输入由一个字符串组成`s`，它表示用户到目前为止输入的文本，后面是之前访问过的页面的列表。 目标是延长`s`从访问列表中获取完整的页面 URL，如果多个页面以以下开头，则选择字典顺序最小的选项`s`。 如果没有页面开头`s`，我们返回`s`不变。 

输入范围很小：最多 100 个访问的页面，每个页面的长度最多 100。这意味着即使是比较前缀的简单线性扫描也能在时间限制内顺利运行，因为最坏情况下的字符比较总数大约为 100 * 100 = 10,000，这对于 2 秒的时间限制来说可以忽略不计。 

非明显的边缘情况包括以下情况`s`已经等于列表中的某个页面，或者当多个页面都有时`s`作为前缀，并且只有一个是按字典顺序最小的。 例如，如果`s = "a"`访问的页面是`["apple", "apricot", "banana"]`，正确的输出是`"apple"`， 不是`"apricot"`。 当没有页面开头时会发生另一种微妙的情况`s`，例如，`s = "xyz"`和页面是`["abc", "def"]`; 输出必须是`"xyz"`。 

## 方法

 暴力方法很简单：遍历所有访问过的页面并检查每个页面是否以`s`。 收集所有匹配项并选择字典顺序最小的一个。 这是可行的，因为页面数量很少。 前缀检查可以使用Python的内置函数来完成`startswith`方法。 在最坏的情况下，我们将每个页面的每个字符与`s`，大致得出`n * len(page)`比较，这里是可以接受的。 

最佳方法依赖于相同的线性扫描，但避免不必要的存储。 我们不收集所有匹配的页面，而是为当前最佳候选者维护一个变量。 对于以以下内容开头的每个页面`s`，如果这个候选者按字典顺序小于前一个候选者，我们就更新它。 这降低了空间复杂度并简化了逻辑。 问题约束足够小，不需要像尝试这样的高级数据结构。 

蛮力之所以有效，是因为迭代所有页面可以保证我们找到每个候选者。 优化减少了内存使用并提高了清晰度，但基本时间复杂度与所有页面的总大小保持线性关系。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m) | O(n * m) | 已接受 |
 | 优化线性扫描 | O(n * m) | O(1) | O(1) | 已接受 |

 这里`n`是页数，`m`是页面的平均长度。 

## 算法演练

 1.读取输入字符串`s`以及访问的页面数`n`。 首先读取输入可确保我们知道要匹配的前缀以及存在多少个候选者。 
2. 初始化变量`best_candidate`作为`None`。 这将保存当前字典顺序最小的页面，从`s`。 
3. 遍历列表`n`页。 对于每个页面，检查它是否以以下内容开头`s`使用`startswith`方法。 此步骤确定自动完成的有效候选者。 
4. 如果页面开头为`s`和`best_candidate`是`None`，将此页面分配给`best_candidate`。 这确保了如果任何页面匹配，我们总是至少有一个候选者。 
5. 如果页面开头为`s`和`best_candidate`不是`None`，将页面与`best_candidate`按字典顺序。 如果较小，则更新`best_candidate`。 这一步保持了不变式`best_candidate`始终是迄今为止最小的匹配页面。 
6. 遍历所有页面后，检查是否`best_candidate`仍然是`None`。 如果是这样，则没有页面匹配，我们打印`s`不变。 否则，打印`best_candidate`。 

为什么它有效：该算法在任何时候都保持不变，`best_candidate`是遇到的按字典顺序最小的页面，开头为`s`。 遍历所有页面可以保证我们不会错过任何候选者，所以到最后，`best_candidate`如果有任何页面匹配，则包含正确答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()
n = int(input())
best_candidate = None

for _ in range(n):
    page = input().strip()
    if page.startswith(s):
        if best_candidate is None or page < best_candidate:
            best_candidate = page

print(best_candidate if best_candidate is not None else s)
```代码首先读取输入的字符串`s`以及访问的页面数。 每一页都会被读取并删除空白。 这`startswith`方法有效地识别匹配。 比较`page < best_candidate`确保选择字典顺序最小的页面。 使用`None`对于初始候选者，避免将其预先设置为可能与实际页面错误比较的值。 

## 工作示例

 使用示例 1：

 | 步骤| 页 | 开始于`s`？ | 最佳人选| 原因 |
 | --- | --- | --- | --- | --- |
 | 1 | 下一个排列 | 是的 | 下一个排列 | 第一场比赛|
 | 2 | 下一个元素 | 是的 | 下一个元素 | 比之前的候选人小 |

 输出：`nextelement`。 这表明算法正确地选择了最小的词典匹配。 

另一个例子：

 输入：```
abc
3
abcd
abce
abd
```| 步骤| 页 | 开始于`s`？ | 最佳人选| 原因 |
 | --- | --- | --- | --- | --- |
 | 1 | abcd| 是的 | abcd| 第一场比赛|
 | 2 | abce | 是的 | abcd| abce > abcd，无变化 |
 | 3 | 阿卜杜勒 | 是的 | abcd| abd > abcd，无变化 |

 输出：`abcd`。 该算法在整个迭代过程中保留最小的前缀匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * m) | n 个页面中的每一个都被逐个字符地检查到长度为 m 的前缀匹配 |
 | 空间| O(1) | O(1) | 无论输入大小如何，仅维护单个字符串变量 |

 假设 n ≤ 100 且 m ≤ 100，该算法最多执行 10,000 个字符比较，这完全在 2 秒的限制之内。 内存使用量极小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    s = input().strip()
    n = int(input())
    best_candidate = None
    for _ in range(n):
        page = input().strip()
        if page.startswith(s):
            if best_candidate is None or page < best_candidate:
                best_candidate = page
    return best_candidate if best_candidate is not None else s

# provided sample
assert run("next\n2\nnextpermutation\nnextelement\n") == "nextelement", "sample 1"

# s matches exactly one page
assert run("abc\n3\nabcd\nabce\nabd\n") == "abcd", "smallest lex first"

# s matches no page
assert run("xyz\n3\nabc\ndef\nghi\n") == "xyz", "no match"

# multiple identical pages
assert run("go\n4\ngo\ngo\ngone\ngood\n") == "go", "multiple identical pages"

# s equals a page exactly
assert run("home\n2\nhome\nhomepage\n") == "home", "exact match"

# minimum input size
assert run("a\n1\na\n") == "a", "single page"

# maximum page length
assert run("longprefix\n2\nlongprefixaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\nlongprefixbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\n") == "longprefixaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "max length comparison"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`abc\n3\nabcd\nabce\nabd\n`|`abcd`| 字典顺序最小的前缀 |
 |`xyz\n3\nabc\ndef\nghi\n`|`xyz`| 没有匹配案例 |
 |`go\n4\ngo\ngo\ngone\ngood\n`|`go`| 多个相同的页面 |
 |`home\n2\nhome\nhomepage\n`|`home`| 精确匹配处理 |
 |`a\n1\na\n`|`a`| 最小尺寸输入 |
 | 长前缀 | 第一个 lex 最小 | 最大长度处理|

 ## 边缘情况

 当`s`匹配没有访问过的页面，例如`s = "xyz"`和页面`["abc", "def"]`，算法永远不会更新`best_candidate`，留下它`None`。 最后打印支票`s`，正确处理这种情况。 

当多个页面以`s`和 相同，第一组比赛`best_candidate`，并且后续的相同页面不会改变它。 为了`s = "go"`和页面`["go", "go", "gone", "good"]`，算法返回`"go"`因为它按照字典顺序已经是最小的了。 

什么时候`s`完全等于一页，例如`s = "home"`和页面`["home", "homepage"]`，算法选择`"home"`正确，因为它开始于`s`并且是最小的
