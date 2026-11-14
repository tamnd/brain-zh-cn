---
title: "CF 44A - 小阳春"
description: "每片叶子由两个字符串描述：树种和叶子颜色。 如果 Alyona 还没有另一片具有完全相同的值对的叶子，则她只会保留一片叶子。 任务只是计算输入中出现了多少种不同的（物种、颜色）组合。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 44
codeforces_index: "A"
codeforces_contest_name: "School Team Contest 2 (Winter Computer School 2010/11)"
rating: 900
weight: 44
solve_time_s: 83
verified: true
draft: false
---

[CF 44A - 小阳春](https://codeforces.com/problemset/problem/44/A)

 **评分：** 900
 **标签：** 实施
 **求解时间：** 1m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每片叶子由两个字符串描述：树种和叶子颜色。 如果 Alyona 还没有另一片具有完全相同的值对的叶子，则她只会保留一片叶子。 

任务只是计算有多少个不同的`(species, color)`组合出现在输入中。 如果同一对出现多次，则只计算一次。 

限制非常小。 最多有 100 个叶子，每个字符串的长度最多为 10。$O(n^2)$基于比较的解决方案很容易满足时间限制，因为最坏的情况只会执行大约 10,000 次比较。 这意味着问题更多的是正确实现而不是算法优化。 

错误的主要原因是误解了重复的内容。 仅当物种和颜色都匹配时，两片叶子才被认为是相同的。 

考虑这个例子：```
3
birch yellow
birch green
birch yellow
```正确答案是：```
2
```仅跟踪物种的粗心实现将错误地返回`1`。 

另一个容易犯的错误是独立于物种来计算颜色。```
3
maple red
birch red
oak red
```正确答案是：```
3
```三片叶子的颜色相同，但它们来自不同的树。 

最后的边缘情况是每片叶子都相同。```
4
oak green
oak green
oak green
oak green
```正确答案是：```
1
```该算法必须避免多次计算重复对。 

## 方法

 最直接的解决办法就是暴力破解。 我们可以逐个处理叶子并维护迄今为止找到的唯一叶子的列表。 对于每一个新叶子，我们扫描列表并检查是否相同`(species, color)`对已经存在。 如果没有，我们添加它。 

这是可行的，因为问题只询问一对是否以前出现过。 由于最多有 100 个叶子，最坏情况的表现约为：$$1 + 2 + 3 + \dots + 99 \approx 5000$$成对比较，完全没问题。 

暴力方法的局限性在于它会重复扫描以前见过的元素。 如果输入大小大得多，这种重复搜索将变得昂贵。 

关键的观察是叶子描述自然地表现得像一个唯一的键。 Python 集正是为此目的而设计的。 集合会自动删除重复项，因此如果我们插入每个`(species, color)`配对成一个集合，最终集合的大小正是不同叶子的数量。 

这将重复的线性搜索变为平均$O(1)$插入和查找操作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n^2)$|$O(n)$| 已接受 |
 | 最佳 |$O(n)$平均 |$O(n)$| 已接受 |

 ## 算法演练

 1.读取整数`n`，叶子的数量。 
2. 创建一个空集，名为`seen`。 

该集合将存储对`(species, color)`。 集合自动忽略重复项。 
3. 重复`n`次数：

 从输入中读取物种和颜色字符串。 
4.插入对`(species, color)`进入集合。 

如果该对已经存在，则该集合保持不变。 如果是新的，则集合增加 1。 
5. 处理完所有叶子后，打印该组的尺寸。 

集合中元素的数量正是不同叶子描述的数量。 

### 为什么它有效

 该算法保持不变式`seen`包含每一个独特的`(species, color)`到目前为止遇到的一对。 

每当处理新叶子时，将其插入集合中都会保留此不变量。 重复的对不会创建额外的条目，而新的对只会添加一次。 

处理完所有叶子后，每个不同的叶子描述在集合中只出现一次。 因此，集合的大小就是所需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    
    seen = set()
    
    for _ in range(n):
        species, color = input().split()
        seen.add((species, color))
    
    print(len(seen))

solve()
```解决方案直接遵循算法。 

套装`seen`存储元组`(species, color)`。 元组在 Python 中是可散列的，因此可以安全有效地将它们插入到集合中。 

该行：```
seen.add((species, color))
```是解决方案的核心。 如果该对已经存在，则不会发生任何变化。 这避免了手动重复检查。 

使用`input().split()`是安全的，因为每行始终包含两个由空格分隔的字符串。 

实现中不存在棘手的边界条件。 即使所有叶子都相同或都是唯一的，该集合也会自动正确运行。 

## 工作示例

 ### 示例 1

 输入：```
5
birch yellow
maple red
birch yellow
maple yellow
maple green
```| 步骤| 当前叶 | 设定内容| 设置尺寸|
 | ---| ---| ---| ---|
 | 1 |`(birch, yellow)`|`{(birch, yellow)}`| 1 |
 | 2 |`(maple, red)`|`{(birch, yellow), (maple, red)}`| 2 |
 | 3 |`(birch, yellow)`|`{(birch, yellow), (maple, red)}`| 2 |
 | 4 |`(maple, yellow)`|`{(birch, yellow), (maple, red), (maple, yellow)}`| 3 |
 | 5 |`(maple, green)`|`{(birch, yellow), (maple, red), (maple, yellow), (maple, green)}`| 4 |

 最终输出：```
4
```此跟踪显示重复插入如何不会更改集合。 

### 示例 2

 输入：```
4
oak green
oak green
oak green
oak green
```| 步骤| 当前叶 | 设定内容| 设置尺寸|
 | ---| ---| ---| ---|
 | 1 |`(oak, green)`|`{(oak, green)}`| 1 |
 | 2 |`(oak, green)`|`{(oak, green)}`| 1 |
 | 3 |`(oak, green)`|`{(oak, green)}`| 1 |
 | 4 |`(oak, green)`|`{(oak, green)}`| 1 |

 最终输出：```
1
```此示例说明重复的相同叶子仅计算一次。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n)$平均 | 每组插入都是平均的$O(1)$|
 | 空间|$O(n)$| 如果所有叶子都是唯一的，则该集合可以存储所有叶子 |

 和$n \le 100$，解决方案很容易足够快。 内存使用量也很小，因为最多只存储 100 对。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())
    
    seen = set()
    
    for _ in range(n):
        species, color = input().split()
        seen.add((species, color))
    
    print(len(seen))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    return sys.stdout.getvalue()

# provided sample
assert run(
"""5
birch yellow
maple red
birch yellow
maple yellow
maple green
"""
) == "4\n", "sample 1"

# minimum input size
assert run(
"""1
oak red
"""
) == "1\n", "minimum case"

# all leaves identical
assert run(
"""4
oak green
oak green
oak green
oak green
"""
) == "1\n", "all equal"

# same color but different species
assert run(
"""3
oak red
birch red
maple red
"""
) == "3\n", "species matters"

# same species but different colors
assert run(
"""4
oak red
oak green
oak yellow
oak red
"""
) == "3\n", "color matters"

# maximum distinct small-style case
inp = "100\n"
for i in range(100):
    inp += f"tree{i} color{i}\n"

assert run(inp) == "100\n", "many unique pairs"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单叶|`1`| 最小输入尺寸|
 | 所有相同的叶子 |`1`| 重复删除 |
 | 相同颜色，不同种类|`3`| 物种是关键的一部分|
 | 同一物种，不同颜色|`3`| 颜色是关键的一部分|
 | 100 片独特的叶子 |`100`| 处理最大不同条目 |

 ## 边缘情况

 考虑只有物种匹配的情况：```
3
oak red
oak green
oak red
```该算法按顺序处理这些对。 

读完后`(oak, red)`，该集合包含一个元素。 

读完后`(oak, green)`，由于颜色改变，这对不同，所以套装尺寸变成了两个。 

决赛`(oak, red)`该集合中已存在，因此大小保持为 2。 

输出是：```
2
```这证实了该算法将两个字段一起比较。 

现在考虑具有相同颜色但不同种类的叶子：```
3
birch yellow
maple yellow
oak yellow
```每次插入都会产生一对新的，因为每次的物种都不同。 

该集合演变为：```
{(birch, yellow)}
{(birch, yellow), (maple, yellow)}
{(birch, yellow), (maple, yellow), (oak, yellow)}
```输出变为：```
3
```这可以防止将颜色单独视为身份的错误。 

最后，考虑完全重复的情况：```
5
pine green
pine green
pine green
pine green
pine green
```第一个插入添加`(pine, green)`到集合。 后来的每个插入都会被忽略，因为该对已经存在。 

最终设定的尺寸为：```
1
```这证实了重复项只被计算一次。
