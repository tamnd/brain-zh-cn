---
title: "CF 64I - 对表格进行排序"
description: "我们得到一个表，其中每行都包含几个字符串字段，第一个输入行告诉我们每列的名称。 另一行描述了如何对行进行排序。 每个规则的形式为 COLUMNNAME ASC 或 COLUMNNAME DESC。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "sortings"]
categories: ["algorithms"]
codeforces_contest: 64
codeforces_index: "I"
codeforces_contest_name: "Unknown Language Round 1"
rating: 2400
weight: 64
solve_time_s: 110
verified: true
draft: false
---

[CF 64I - 对表格进行排序](https://codeforces.com/problemset/problem/64/I)

 **评分：** 2400
 **标签：** *特殊、排序
 **求解时间：** 1m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个表，其中每行都包含几个字符串字段，第一个输入行告诉我们每列的名称。 另一行描述了如何对行进行排序。 每个规则都有以下形式`COLUMN_NAME ASC`或者`COLUMN_NAME DESC`。 

排序的行为与数据库完全相同`ORDER BY`条款。 第一条规则具有最高优先级。 如果根据该规则两行相等，我们将使用第二条规则比较它们，依此类推。 如果所有规则都认为两行相等，则它们的原始顺序必须保持不变。 最后一个要求意味着排序必须稳定。 

按照竞争性编程标准，表的尺寸很小。 行数和列数都最多为 100。即使是`O(n^2)`或者`O(n^2 log n)`解决方案在这里是完全安全的。 昂贵的部分不是行数，而是在保持稳定性的同时处理具有不同方向的多个排序键。 

棘手的部分不是性能，而是正确性。 粗心的实现很容易破坏排序规则。 

考虑这个例子：```
A B
A ASC, B DESC
x 1
x 3
x 2
```正确输出：```
x 3
x 2
x 1
```如果我们只按第一个键排序`A`，行保持不变，因为所有值都相等。 第二把钥匙仍然很重要。 

另一个微妙的情况是稳定性：```
A
A ASC
x
x
x
```正确输出：```
x
x
x
```稳定排序会保留相等元素的原始顺序。 某些自定义比较器实现会意外地对相等的行进行重新排序，因为它们返回不一致的结果。 

混合方向是错误的另一个常见来源：```
A B
A DESC, B ASC
1 z
2 y
2 x
```正确输出：```
2 x
2 y
1 z
```第一个键是降序，第二个键是升序。 如果我们反转整个比较结果而不是独立处理每个键，则排序就会错误。 

最后，解析规则行需要小心。 规则由以下分隔符分隔`", "`，不仅仅是逗号。 错误的分割可能会在字段名称或方向上留下额外的空格。 

## 方法

 最直接的解决方案是手动比较行。 对于每一对行，我们逐一检查规则，直到找到行不同的字段。 如果当前规则是升序，我们使用正常的字典顺序。 如果它是下降的，我们就反转比较。 如果所有规则都匹配，则行被视为相等，并且它们的原始顺序应保持不变。 

这种方法在概念上很简单，因为它准确地反映了该声明。 我们可以将这样的比较器插入到排序算法中。 对于最多 100 行，即使是像冒泡排序这样的二次稳定排序也能轻松通过。 最坏的情况就在身边`100^2 * 100`，这只是一百万个字段比较。 

尽管如此，Python 已经为我们提供了稳定的排序算法 TimSort。 正确使用它可以使实现更加清晰并且不易出错。 

关键的观察结果是，稳定排序允许我们按照从最低优先级到最高优先级的顺序处理规则。 假设规则是：```
A ASC, B DESC, C ASC
```我们首先排序`C`，然后由`B`，然后由`A`。 

为什么这有效？ 排序后`C`，行按最低优先级键正确排序。 当我们稍后排序时`B`，具有不同的行`B`值被正确重新排序，而具有相同值的行`B`保留他们以前的`C`排序是因为Python的排序是稳定的。 重复这个过程最终会产生我们想要的精确的字典多键排序。 

这完全消除了对自定义比较器的需要。 每个排序过程都使用一个字段和一个简单的`reverse=True/False`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力比较器排序 | O(r² × k) | O(1) | O(1) | 已接受 |
 | 稳定的多遍排序 | O(k × r log r) | O(k × r log r) | O(r) | 已接受 |

 这里，`r`是行数并且`k`是排序规则的数量。 

## 算法演练

 1. 读取列名并将每列的位置存储在字典中。 

这让我们可以转换字段名称，例如`"AGE"`在恒定时间内进入其列索引。 
2. 阅读规则行并将其拆分为`", "`。 

每一件作品看起来都像`"FIELD ASC"`或者`"FIELD DESC"`。 
3. 将每个规则解析为两个值：列索引和顺序是否降序。 

例如，`"AGE DESC"`变成`(2, True)`如果`AGE`是第三列。 
4. 将所有剩余行读取为表行。 

每行都存储为字符串列表。 
5. 以相反的顺序处理规则。 

必须首先应用最不重要的规则，因为后来的稳定排序会保留早期的平局决定。 
6. 对于每个规则，使用相应的列作为键对行进行排序。 

使用`reverse=True`对于降序排列和`reverse=False`对于升序。 
7. 按最终顺序打印行。 

### 为什么它有效

 处理完最后一条规则后，行将根据最低优先级条件正确排序。 

假设从位置处理规则后`i + 1`之后，行已经根据所有较低优先级规则正确排序。 当我们稳定地按规则排序时`i`，具有不同规则值的行`i`进入正确的相对顺序。 规则值相等的行`i`保留之前的排序，因为排序是稳定的。 保留的顺序已经满足每一个较低优先级的规则。 

通过归纳，处理完所有规则后，行满足问题所需的完整字典顺序。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    columns = input().split()

    pos = {}
    for i, name in enumerate(columns):
        pos[name] = i

    rules_line = input().strip()
    rules_raw = rules_line.split(", ")

    rules = []

    for rule in rules_raw:
        field, order = rule.split()
        rules.append((pos[field], order == "DESC"))

    rows = []

    for line in sys.stdin:
        line = line.strip()

        if not line:
            continue

        rows.append(line.split())

    for col, rev in reversed(rules):
        rows.sort(key=lambda row: row[col], reverse=rev)

    for row in rows:
        print(*row)

solve()
```第一部分构建从列名到索引的映射。 这可以避免每当规则引用字段时重复的线性搜索。 

规则成对存储`(column_index, is_descending)`。 尽早将所有内容转换为索引可以使排序循环保持简单。 

读取行直到 EOF 自然地匹配输入格式，因为行数没有明确给出。 

最重要的实现细节是迭代`reversed(rules)`。 按原始顺序处理它们会破坏先前建立的更高优先级的顺序。 

通话：```
rows.sort(key=lambda row: row[col], reverse=rev)
```之所以有效，是因为 Python 排序是稳定的。 相等的元素会自动保持其较早的顺序。 

所有比较都是字典字符串比较，完全按照语句的要求。 我们从不将值转换为整数。 

## 工作示例

 ### 示例 1

 输入：```
NAME GROUP AGE
GROUP ASC, AGE DESC
Alex 412 19
Peter 422 19
Sergey 412 18
Andrey 311 18
```解析后的规则：

 | 规则优先级 | 专栏 | 订单|
 | ---| ---| ---|
 | 1 | 集团| ASC |
 | 2 | 年龄| 描述 |

 我们以相反的顺序处理它们。 

#### 按年龄 DESC 排序

 | 行| 年龄|
 | ---| ---|
 | 亚历克斯 412 19 | 19 | 19
 | 彼得 422 19 | 19 | 19
 | 谢尔盖 412 18 | 18 | 18
 | 安德烈 311 18 | 18 | 18

 排序后的状态：

 | 位置 | 行|
 | ---| ---|
 | 1 | 亚历克斯 412 19 |
 | 2 | 彼得 422 19 |
 | 3 | 谢尔盖 412 18 |
 | 4 | 安德烈 311 18 |

 #### 按组 ASC 排序

 | 行| 集团|
 | ---| ---|
 | 亚历克斯 412 19 | 412 | 412
 | 彼得 422 19 | 422 | 422
 | 谢尔盖 412 18 | 412 | 412
 | 安德烈 311 18 | 311 | 311

 最终订单：

 | 位置 | 行|
 | ---| ---|
 | 1 | 安德烈 311 18 |
 | 2 | 亚历克斯 412 19 |
 | 3 | 谢尔盖 412 18 |
 | 4 | 彼得 422 19 |

 这条轨迹显示了为什么稳定性很重要。 两行都有组`412`仍然按年龄降序排列，因为该排序是较早建立的。 

### 示例 2

 输入：```
A B
A DESC, B ASC
1 z
2 y
2 x
```解析后的规则：

 | 规则优先级 | 专栏 | 订单|
 | ---| ---| ---|
 | 1 | 一个 | 描述 |
 | 2 | 乙| ASC |

 #### 按 B ASC 排序

 | 位置 | 行|
 | ---| ---|
 | 1 | 2 个 |
 | 2 | 2 年 |
 | 3 | 1 兹 |

 #### 按 DESC 排序

 | 位置 | 行|
 | ---| ---|
 | 1 | 2 个 |
 | 2 | 2 年 |
 | 3 | 1 兹 |

 行与`A = 2`保留他们早期的`B ASC`排序，因为第二种排序是稳定的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(k × r log r) | O(k × r log r) | 我们对每条规则执行一种排序 |
 | 空间| O(r) | Python排序可能会使用辅助内存 |

 这里，`r`是行数并且`k`是规则的数量。 

最多 100 行和 100 列，它会立即运行。 在限制范围内，即使是几次完整的分拣过程也可以忽略不计。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    columns = input().split()

    pos = {}
    for i, name in enumerate(columns):
        pos[name] = i

    rules_line = input().strip()
    rules_raw = rules_line.split(", ")

    rules = []

    for rule in rules_raw:
        field, order = rule.split()
        rules.append((pos[field], order == "DESC"))

    rows = []

    for line in sys.stdin:
        line = line.strip()

        if not line:
            continue

        rows.append(line.split())

    for col, rev in reversed(rules):
        rows.sort(key=lambda row: row[col], reverse=rev)

    out = []

    for row in rows:
        out.append(" ".join(row))

    print("\n".join(out))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    return sys.stdout.getvalue()

# provided sample
assert run(
"""NAME GROUP AGE
GROUP ASC, AGE DESC
Alex 412 19
Peter 422 19
Sergey 412 18
Andrey 311 18
"""
) == (
"""Andrey 311 18
Alex 412 19
Sergey 412 18
Peter 422 19
"""
), "sample 1"

# minimum size
assert run(
"""A
A ASC
x
"""
) == (
"""x
"""
), "single row"

# stability check
assert run(
"""A B
A ASC
x 1
x 2
x 3
"""
) == (
"""x 1
x 2
x 3
"""
), "stable ordering"

# mixed ascending and descending
assert run(
"""A B
A DESC, B ASC
1 z
2 y
2 x
"""
) == (
"""2 x
2 y
1 z
"""
), "mixed directions"

# lexicographic comparison
assert run(
"""A
A ASC
10
2
9
"""
) == (
"""10
2
9
"""
), "strings not integers"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单排表| 相同的单行 | 最小输入尺寸 |
 | 所有相同的主键 | 保留原始订单 | 稳定分选 |
 | 混合 ASC 和 DESC | 正确的分层排序 | 方向处理 |
 | 价值观`10`,`2`,`9`| 字典顺序 | 字符串不是整数 |

 ## 边缘情况

 考虑每个规则下的行相等：```
A B
A ASC, B DESC
x 1
x 1
x 1
```该算法首先排序`B DESC`，这不会改变任何内容，因为所有值都相等。 然后它排序`A ASC`，这也没有改变任何东西。 由于 Python 排序是稳定的，因此原始顺序会被准确保留。 

现在考虑相互冲突的方向：```
A B
A DESC, B ASC
2 z
2 x
1 y
```该算法首先排序`B ASC`：```
2 x
1 y
2 z
```然后它排序`A DESC`：```
2 x
2 z
1 y
```在行中，其中`A = 2`, 上一个`B ASC`排序得以保留是因为第二种排序是稳定的。 

最后，考虑字典顺序行为：```
A
A ASC
2
10
9
```字符串比较给出：```
10
2
9
```因为`"10"`出现在之前`"2"`按字典顺序。 该算法会自动处理此问题，因为它从不将字符串转换为数字。
